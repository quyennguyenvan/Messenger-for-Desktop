if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _electron = require("electron");
var _lodash = _interopRequireDefault(require("lodash.debounce"));
var _events = _interopRequireDefault(require("events"));
var _path = _interopRequireDefault(require("path"));
var _filePaths = _interopRequireDefault(require("common/utils/file-paths"));
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _context = _interopRequireDefault(require("browser/menus/context"));
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class MainWindowManager extends _events.default {
  constructor() {
    super();
    this.forceClose = false;
    this.updateInProgress = false;
    this.startHidden = global.options.osStartup && _prefs.default.get('launch-startup-hidden');
    this.initialTitle = global.manifest.productName;
  }
  setTrayManager(trayManager) {
    this.trayManager = trayManager;
  }
  setMenuManager(menuManager) {
    this.menuManager = menuManager;
  }
  setNotifManager(notifManager) {
    this.notifManager = notifManager;
  }
  createWindow() {
    log('creating main window');
    let bounds = _prefs.default.get('window-bounds');
    if (!this.windowBoundsAreValid(bounds)) {
      log('invalid window bounds, using default', bounds);
      bounds = _prefs.default.getDefault('window-bounds');
      _prefs.default.unset('window-bounds');
    }
    const defaultOptions = {
      title: this.initialTitle,
      backgroundColor: '#ffffff',
      autoHideMenuBar: _prefs.default.get('auto-hide-menubar'),
      acceptFirstMouse: _prefs.default.get('accept-first-mouse'),
      darkTheme: global.manifest.darkThemes.includes(_prefs.default.get('theme')),
      useContentSize: true,
      minWidth: 500,
      minHeight: 500,
      show: false,
      webPreferences: {
        // Keep behavior close to legacy app while making it explicit.
        // This app runs only local UI + a remote Messenger webview.
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false,
        webviewTag: true,
        enableRemoteModule: true
      }
    };

    // Fix Window icon on Linux
    if (_platform.default.isLinux) {
      defaultOptions.icon = _filePaths.default.getImagePath('windowIcon.png');
    }
    const options = Object.assign(defaultOptions, bounds);
    this.window = new _electron.BrowserWindow(options);
  }
  initWindow() {
    // Replace the default user agent
    const cleanUA = this.getCleanUserAgent();
    this.window.webContents.setUserAgent(cleanUA);

    // Bind webContents events to local methods
    this.window.webContents.on('will-navigate', this.onWillNavigate.bind(this));

    // Bind events to local methods
    this.window.on('ready-to-show', this.onReadyToShow.bind(this));
    this.window.on('enter-full-screen', this.onEnterFullScreen.bind(this));
    this.window.on('leave-full-screen', this.onLeaveFullScreen.bind(this));
    this.window.on('closed', this.onClosed.bind(this));
    this.window.on('close', this.onClose.bind(this));
    this.window.on('focus', this.onFocus.bind(this));
    this.window.on('blur', this.onBlur.bind(this));
    this.window.on('show', this.onShow.bind(this));
    this.window.on('hide', this.onHide.bind(this));

    // Save the bounds on resize or move
    const saveBounds = (0, _lodash.default)(this.saveBounds.bind(this), 500);
    this.window.on('resize', saveBounds);
    this.window.on('move', saveBounds);

    // Restore full screen state
    const isFullScreen = _prefs.default.get('window-full-screen');
    this.window.setFullScreen(isFullScreen);

    // Finally, load the app html
    const appHtml = _path.default.join(_electron.app.getAppPath(), 'html', 'app.html');
    this.window.loadFile(appHtml);
  }

  /**
   * Validate the window bounds by making sure they're not off-screen.
   */
  windowBoundsAreValid(bounds) {
    return bounds.x !== -32000 && bounds.y !== -32000;
  }

  /**
   * Called when the 'will-navigate' event is emitted.
   */
  onWillNavigate(event, url) {
    if (global.manifest.dev) {
      log('navigation not prevented (dev mode)', url);
    } else {
      // Don't navigate away
      event.preventDefault();
      log('navigation prevented', url);
    }
  }

  /**
   * Called when the 'ready-to-show' event is emitted.
   */
  onReadyToShow() {
    // Show the window
    log('ready-to-show');
    if (!this.startHidden && !this.window.isVisible()) {
      this.window.show();
    }
  }

  /**
   * Called when the 'enter-full-screen' event is emitted.
   */
  onEnterFullScreen() {
    if (_platform.default.isLinux) {
      return; // this event isn't triggered correctly on linux
    }
    // Save in prefs
    _prefs.default.set('window-full-screen', true);
  }

  /**
   * Called when the 'leave-full-screen' event is emitted.
   */
  onLeaveFullScreen() {
    if (_platform.default.isLinux) {
      return; // this event isn't triggered correctly on linux
    }
    // Save in prefs
    _prefs.default.set('window-full-screen', false);
  }

  /**
   * Called when the 'closed' event is emitted.
   * Remove the internal reference to the window.
   */
  onClosed() {
    log('onClosed');
    this.window = null;
    this.emit('closed');
  }

  /**
   * Called when the 'close' event is emitted.
   */
  onClose(event) {
    log('onClose', 'forceClose=' + this.forceClose);

    // The app is being updated, don't prevent closing
    if (this.updateInProgress) {
      return;
    }

    // Just hide the window on Darwin
    if (!this.forceClose && _platform.default.isDarwin) {
      event.preventDefault();
      this.hideWindow();
    }

    // Just hide the window if it's already running in the tray
    if (!this.forceClose && _prefs.default.get('show-tray')) {
      event.preventDefault();
      this.hideWindow();

      // Inform the user the app is still running
      if (_platform.default.isWindows && !_prefs.default.get('quit-behaviour-taught')) {
        const tray = this.trayManager.tray;
        if (tray) {
          tray.displayBalloon({
            title: global.manifest.productName,
            content: global.manifest.productName + ' will keep running in the tray until you quit it.'
          });
          _prefs.default.set('quit-behaviour-taught', true);
        }
      }
    }
  }

  /**
   * Called when the 'focus' event is emitted.
   */
  onFocus() {
    log('onFocus');

    // Forward this event to the webview
    this.window.webContents.send('call-webview-method', 'focus');

    // Validate window bounds
    let bounds = this.window.getBounds();
    if (!this.windowBoundsAreValid(bounds)) {
      log('invalid window bounds, restoring to default', bounds);
      _prefs.default.unset('window-bounds');
      bounds = _prefs.default.getDefault('window-bounds');
      this.window.setSize(bounds.width, bounds.height, true);
      this.window.center();
    }

    // Remove notifications count
    this.notifCountChanged('', null);
  }

  /**
   * Called when the 'blur' event is emitted.
   */
  onBlur() {
    log('onBlur');

    // Forward this event to the webview
    this.window.webContents.send('call-webview-method', 'blur');
  }

  /**
   * Called when the 'show' event is emitted.
   */
  onShow() {
    log('onShow');

    // Enable window specific menu items
    if (this.menuManager) {
      this.menuManager.windowSpecificItemsEnabled(true);
    }
  }

  /**
   * Called when the 'hide' event is emitted.
   */
  onHide() {
    log('onHide');

    // Disable window specific menu items
    if (this.menuManager) {
      this.menuManager.windowSpecificItemsEnabled(false);
    }
  }

  /**
   * Persist the current window's state.
   */
  saveBounds() {
    if (this.window.isFullScreen()) {
      return;
    }
    log('saving bounds');
    const bounds = this.window.getBounds();
    _prefs.default.set('window-bounds', bounds);
  }

  /**
   * Remove identifiable information (e.g. app name) from the UA string.
   */
  getCleanUserAgent() {
    return this.window.webContents.getUserAgent().replace(new RegExp(global.manifest.productName + '/[\\S]*', 'g'), '').replace(new RegExp('Electron/[\\S]*', 'g'), '').replace(new RegExp('\\s+', 'g'), ' ');
  }

  /**
   * Update the notifications count everywhere.
   */
  notifCountChanged(count, badgeDataUrl) {
    if (this.notifManager) {
      this.notifManager.unreadCount = count;
    }

    // Set icon badge
    if (_prefs.default.get('show-notifications-badge')) {
      if (_platform.default.isWindows) {
        if (count) {
          const image = _electron.nativeImage.createFromDataURL(badgeDataUrl);
          this.window.setOverlayIcon(image, count);
        } else {
          this.window.setOverlayIcon(null, '');
        }
      } else {
        _electron.app.setBadgeCount(parseInt(count, 10) || 0);
      }
    }

    // Update tray
    if (this.trayManager) {
      this.trayManager.unreadCountUpdated(count);
    }

    // Update window title
    this.prefixWindowTitle(count ? '(' + count + ') ' : '');
  }

  /**
   * Called by the renderer process to open the context menu.
   */
  openContextMenu(params) {
    log('open context menu');
    try {
      params = JSON.parse(params);
      const menu = _context.default.create(params, this.window);
      if (menu) {
        log('opening context menu');
        setTimeout(() => {
          menu.popup(this.window);
        }, 50);
      }
    } catch (err) {
      logError(err);
    }
  }

  /**
   * Show and focus or create the main window.
   */
  showOrCreate() {
    if (this.window) {
      this.window.show();
    } else {
      this.createWindow();
      this.initWindow();
    }
  }

  /**
   * Append a prefix to the window title.
   */
  prefixWindowTitle(prefix) {
    if (this.window) {
      this.window.setTitle(prefix + this.initialTitle);
    }
  }

  /**
   * Append a suffix to the window title.
   */
  suffixWindowTitle(suffix) {
    if (this.window) {
      this.window.setTitle(this.initialTitle + suffix);
    }
  }

  /**
   * Hide the whole app on OS X, not just the window.
   */
  hideWindow() {
    if (_platform.default.isDarwin) {
      _electron.Menu.sendActionToFirstResponder('hide:');
      this.window.hide();
    } else {
      this.window.hide();
    }
  }
}
var _default = exports.default = MainWindowManager;