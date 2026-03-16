if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = _interopRequireDefault(require("events"));
var _mainWindowManager = _interopRequireDefault(require("browser/managers/main-window-manager"));
var _autoUpdateManager = _interopRequireDefault(require("browser/managers/auto-update-manager"));
var _mainMenuManager = _interopRequireDefault(require("browser/managers/main-menu-manager"));
var _notifManager = _interopRequireDefault(require("browser/managers/notif-manager"));
var _nativeNotifier = _interopRequireDefault(require("browser/components/native-notifier"));
var _autoLauncher = _interopRequireDefault(require("browser/components/auto-launcher"));
var _trayManager = _interopRequireDefault(require("browser/managers/tray-manager"));
var _appListenersManager = _interopRequireDefault(require("browser/managers/app-listeners-manager"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Application extends _events.default {
  init() {
    // Create the main app window
    this.mainWindowManager = new _mainWindowManager.default();
    this.mainWindowManager.createWindow();
    this.mainWindowManager.initWindow();

    // Enable the auto updater
    this.autoUpdateManager = new _autoUpdateManager.default(this.mainWindowManager);
    if (this.autoUpdateManager.enabled) {
      this.autoUpdateManager.init();
      this.autoUpdateManager.scheduleUpdateChecks();
    }

    // Create and set the main menu
    this.menuManager = new _mainMenuManager.default();
    this.menuManager.create();
    this.menuManager.setDefault();
    this.menuManager.setAutoUpdaterListeners();
    this.mainWindowManager.setMenuManager(this.menuManager);

    // Others
    this.notifManager = new _notifManager.default();
    this.mainWindowManager.setNotifManager(this.notifManager);
    this.nativeNotifier = new _nativeNotifier.default(this.mainWindowManager);
    this.autoLauncher = new _autoLauncher.default();

    // Create and set the tray icon
    this.trayManager = new _trayManager.default(this.mainWindowManager, this.notifManager);
    this.mainWindowManager.setTrayManager(this.trayManager);

    // Listeners
    new _appListenersManager.default(this.mainWindowManager, this.autoUpdateManager).set();
  }
}
var _default = exports.default = Application;