if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = _interopRequireDefault(require("events"));
var _electron = require("electron");
var _filePaths = _interopRequireDefault(require("common/utils/file-paths"));
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _tray = _interopRequireDefault(require("browser/menus/tray"));
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class TrayManager extends _events.default {
  constructor(mainWindowManager, notifManager) {
    super();
    this.mainWindowManager = mainWindowManager;
    this.notifManager = notifManager;

    // Restore the tray menu from prefs
    if (_prefs.default.get('show-tray')) {
      this.create();
    }
  }

  /**
   * Create and set the default menu.
   */
  create() {
    if (this.tray) {
      return;
    }
    if (_platform.default.isDarwin) {
      const imagePath = _filePaths.default.getImagePath('trayBlackTemplate.png');
      const image = _electron.nativeImage.createFromPath(imagePath);
      const pressedImagePath = _filePaths.default.getImagePath('trayWhiteTemplate.png');
      const pressedImage = _electron.nativeImage.createFromPath(pressedImagePath);
      this.tray = new _electron.Tray(image);
      this.tray.setPressedImage(pressedImage);

      // Show the notifications count
      if (this.notifManager.unreadCount) {
        this.tray.setTitle(this.notifManager.unreadCount);
      }
    } else {
      const imgExt = _platform.default.isWindows ? 'ico' : 'png';
      const iconName = this.notifManager.unreadCount ? 'trayAlert' : 'tray';
      const imagePath = _filePaths.default.getImagePath(iconName + '.' + imgExt);
      const image = _electron.nativeImage.createFromPath(imagePath);
      this.tray = new _electron.Tray(image);
    }
    this.menu = _electron.Menu.buildFromTemplate((0, _tray.default)());
    if (_platform.default.isLinux) {
      this.tray.setContextMenu(this.menu);
    }
    this.setEventListeners();
    log('tray menu created');
  }

  /**
   * Listen for tray events.
   */
  setEventListeners() {
    if (this.tray) {
      this.tray.on('click', this.onClick.bind(this));
      this.tray.on('right-click', this.onRightClick.bind(this));
    }
  }

  /**
   * Called when the 'click' event is emitted on the tray menu.
   */
  onClick() {
    // Show the main window
    log('tray click');
    if (this.mainWindowManager) {
      const mainWindow = this.mainWindowManager.window;
      if (mainWindow) {
        mainWindow.show();
      }
    }
  }

  /**
   * Called when the 'right-click' event is emitted on the tray menu.
   */
  onRightClick() {
    // Show the context menu
    log('tray right-click');
    this.tray.popUpContextMenu(this.menu);
  }

  /**
   * Hide and destroy the tray menu.
   */
  destroy() {
    if (this.tray) {
      this.tray.destroy();
    }
    this.menu = null;
    this.tray = null;
  }

  /**
   * Called when the unread count changes.
   */
  unreadCountUpdated(count) {
    if (!this.tray) {
      return;
    }
    if (_platform.default.isDarwin) {
      this.tray.setTitle(count);
    } else {
      const imgExt = _platform.default.isWindows ? 'ico' : 'png';
      const iconName = count ? 'trayAlert' : 'tray';
      const imagePath = _filePaths.default.getImagePath(iconName + '.' + imgExt);
      const image = _electron.nativeImage.createFromPath(imagePath);
      this.tray.setImage(image);
    }
  }
}
var _default = exports.default = TrayManager;