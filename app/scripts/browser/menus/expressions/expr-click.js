if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analytics = void 0;
exports.appQuit = appQuit;
exports.autoHideMenuBar = autoHideMenuBar;
exports.blockSeenTyping = blockSeenTyping;
exports.cfuCheckForUpdate = cfuCheckForUpdate;
exports.cfuUpdateAvailable = cfuUpdateAvailable;
exports.cfuUpdateDownloaded = cfuUpdateDownloaded;
exports.checkForUpdateAuto = checkForUpdateAuto;
exports.floatOnTop = floatOnTop;
exports.hideDockBadge = hideDockBadge;
exports.hideTaskbarBadge = hideTaskbarBadge;
exports.launchOnStartup = launchOnStartup;
exports.openDebugLog = openDebugLog;
exports.openUrl = openUrl;
exports.reloadWindow = reloadWindow;
exports.resetAutoUpdaterUrl = resetAutoUpdaterUrl;
exports.resetWindow = resetWindow;
exports.restartApp = restartApp;
exports.restartInDebugMode = restartInDebugMode;
exports.sendToWebContents = sendToWebContents;
exports.sendToWebView = sendToWebView;
exports.showCustomAboutDialog = showCustomAboutDialog;
exports.showInDock = showInDock;
exports.showInTray = showInTray;
exports.showWindow = showWindow;
exports.toggleDevTools = toggleDevTools;
exports.toggleFullScreen = toggleFullScreen;
exports.toggleWebViewDevTools = toggleWebViewDevTools;
var _electron = require("electron");
var piwik = _interopRequireWildcard(require("browser/services/piwik"));
var requestFilter = _interopRequireWildcard(require("browser/utils/request-filter"));
var _filePaths = _interopRequireDefault(require("common/utils/file-paths"));
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Call the handler for the check-for-update event.
 */
function cfuCheckForUpdate(informUser) {
  return function () {
    global.application.autoUpdateManager.handleMenuCheckForUpdate(informUser);
  };
}

/**
 * Call the handler for the update-available event.
 */
function cfuUpdateAvailable() {
  return function () {
    global.application.autoUpdateManager.handleMenuUpdateAvailable();
  };
}

/**
 * Call the handler for the update-downloaded event.
 */
function cfuUpdateDownloaded() {
  return function () {
    global.application.autoUpdateManager.handleMenuUpdateDownloaded();
  };
}

/**
 * Reset the auto updater url (to use updated prefs).
 */
function resetAutoUpdaterUrl() {
  return function () {
    global.application.autoUpdateManager.initFeedUrl();
  };
}

/**
 * Enable or disable automatic checks for update.
 */
function checkForUpdateAuto(valueExpr) {
  return function () {
    const check = valueExpr.apply(this, arguments);
    global.application.autoUpdateManager.setAutoCheck(check);
  };
}

/**
 * Quit the app.
 */
function appQuit() {
  return function () {
    _electron.app.quit();
  };
}

/**
 * Restart the app.
 */
function restartApp() {
  return function () {
    _electron.app.relaunch();
    _electron.app.quit();
  };
}

/**
 * Open the url externally, in a browser.
 */
function openUrl(url) {
  return function () {
    _electron.shell.openExternal(url);
  };
}

/**
 * Show a mac-like About dialog.
 */
function showCustomAboutDialog() {
  return function () {
    _electron.dialog.showMessageBox({
      icon: _filePaths.default.getImagePath('app_icon.png'),
      title: 'About ' + global.manifest.productName,
      message: global.manifest.productName + ' v' + global.manifest.version + '-' + global.manifest.versionChannel,
      detail: global.manifest.copyright + '\n\n' + 'Special thanks to @sytten, @nevercast' + ', @TheHimanshu, @MichaelAquilina, @franciscoib, @levrik, and all the contributors on GitHub.'
    });
  };
}

/**
 * Send a message directly to the webview.
 */
function sendToWebView(channel, ...valueExprs) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const values = valueExprs.map(e => e.apply(this, arguments));
    browserWindow.webContents.send('fwd-webview', channel, ...values);
  };
}

/**
 * Send a message to the current BrowserWindow's WebContents.
 */
function sendToWebContents(channel, ...valueExprs) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const values = valueExprs.map(e => e.apply(this, arguments));
    browserWindow.webContents.send(channel, ...values);
  };
}

/**
 * Reload the browser window.
 */
function reloadWindow() {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    browserWindow.webContents.reloadIgnoringCache();
  };
}

/**
 * Reset the window's position and size.
 */
function resetWindow() {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const bounds = _prefs.default.getDefault('window-bounds');
    browserWindow.setSize(bounds.width, bounds.height, true);
    browserWindow.center();
  };
}

/**
 * Show (and focus) the window.
 */
function showWindow() {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    if (browserWindow) {
      browserWindow.show();
    }
  };
}

/**
 * Toggle whether the window is in full screen or not.
 */
function toggleFullScreen() {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const newState = !browserWindow.isFullScreen();
    browserWindow.setFullScreen(newState);
  };
}

/**
 * Toggle the dev tools panel.
 */
function toggleDevTools() {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    browserWindow.toggleDevTools();
  };
}

/**
 * Toggle the webview's dev tools panel.
 */
function toggleWebViewDevTools() {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    browserWindow.webContents.send('toggle-wv-dev-tools');
  };
}

/**
 * Whether the menu bar should hide automatically.
 */
function autoHideMenuBar(autoHideExpr) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const autoHide = autoHideExpr.apply(this, arguments);
    browserWindow.setAutoHideMenuBar(autoHide);
  };
}

/**
 * Whether the window should always appear on top.
 */
function floatOnTop(flagExpr) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const flag = flagExpr.apply(this, arguments);
    browserWindow.setAlwaysOnTop(flag);
  };
}

/**
 * Show or hide the tray icon.
 */
function showInTray(flagExpr) {
  return function () {
    const show = flagExpr.apply(this, arguments);
    if (show) {
      global.application.trayManager.create();
    } else {
      global.application.trayManager.destroy();
    }
  };
}

/**
 * Show or hide the dock icon.
 */
function showInDock(flagExpr) {
  return function () {
    if (_electron.app.dock && _electron.app.dock.show && _electron.app.dock.hide) {
      const show = flagExpr.apply(this, arguments);
      if (show) {
        _electron.app.dock.show();
      } else {
        _electron.app.dock.hide();
      }
    }
  };
}

/**
 * Whether the app should launch automatically when the OS starts.
 */
function launchOnStartup(enabledExpr) {
  return function () {
    const enabled = enabledExpr.apply(this, arguments);
    if (enabled) {
      global.application.autoLauncher.enable().then(() => log('auto launcher enabled')).catch(err => {
        log('could not enable auto-launcher');
        logError(err, true);
      });
    } else {
      global.application.autoLauncher.disable().then(() => log('auto launcher disabled')).catch(err => {
        log('could not disable auto-launcher');
        logError(err, true);
      });
    }
  };
}

/**
 * If flag is false, the dock badge will be hidden.
 */
function hideDockBadge(flagExpr) {
  return function () {
    const flag = flagExpr.apply(this, arguments);
    if (!flag) {
      _electron.app.setBadgeCount(0);
    }
  };
}

/**
 * If flag is false, the taskbar badge will be hidden.
 */
function hideTaskbarBadge(flagExpr) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const flag = flagExpr.apply(this, arguments);
    if (!flag) {
      browserWindow.setOverlayIcon(null, '');
    }
  };
}

/**
 * Whether the user should appear as online and 'is typing' indicators be sent.
 */
function blockSeenTyping(flagExpr) {
  return function (menuItem, browserWindow) {
    const shouldBlock = flagExpr.apply(this, arguments);
    requestFilter.set(shouldBlock, browserWindow.webContents.session);
  };
}

// Analytics
const analytics = exports.analytics = {
  /**
   * Track an event.
   */
  trackEvent: (...args) => {
    return function (menuItem, browserWindow) {
      const tracker = piwik.getTracker();
      if (tracker) {
        tracker.trackEvent(...args);
      }
    };
  }
};

/**
 * Restart the app in debug mode.
 */
function restartInDebugMode() {
  return function () {
    const options = {
      // without --no-console-logs, calls to console.log et al. trigger EBADF errors in the new process
      args: [...process.argv.slice(1), '--debug', '--no-console-logs']
    };
    log('relaunching app', JSON.stringify(options));
    _electron.app.relaunch(options);
    _electron.app.exit(0);
  };
}

/**
 * Open the log file for easier debugging.
 */
function openDebugLog() {
  return function () {
    if (global.__debug_file_log_path) {
      log('opening log file with default app', global.__debug_file_log_path);
      _electron.shell.openItem(global.__debug_file_log_path);
    } else {
      logError(new Error('global.__debug_file_log_path was falsy'));
    }
  };
}