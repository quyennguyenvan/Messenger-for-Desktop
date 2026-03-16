if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = _interopRequireDefault(require("events"));
var _electron = require("electron");
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AppListenersManager extends _events.default {
  constructor(mainWindowManager, autoUpdateManager) {
    super();
    this.mainWindowManager = mainWindowManager;
    this.autoUpdateManager = autoUpdateManager;
  }

  /**
   * Bind events to local methods.
   */
  set() {
    _electron.app.on('before-quit', this.onBeforeQuit.bind(this));
    _electron.app.on('will-quit', this.onWillQuit.bind(this));
    _electron.app.on('window-all-closed', this.onAllWindowsClosed.bind(this));
    _electron.app.on('activate', this.onActivate.bind(this));
  }

  /**
   * Called when the 'before-quit' event is emitted.
   */
  onBeforeQuit() {
    // Set a flag to close the main window instead of hiding it
    log('before quit');
    if (this.mainWindowManager) {
      this.mainWindowManager.forceClose = true;
    }
  }

  /**
   * Called when the 'will-quit' event is emitted.
   */
  onWillQuit(event) {
    // Update the app before actually quitting
    log('will quit');
    const hasUpdate = this.autoUpdateManager.state === this.autoUpdateManager.states.UPDATE_DOWNLOADED;
    const isUpdating = this.mainWindowManager.updateInProgress;
    try {
      if (hasUpdate && !isUpdating) {
        log('has update downloaded, installing it before quitting');
        event.preventDefault();
        _prefs.default.setSync('launch-quit', true);
        _prefs.default.setSync('notify-app-updated', true);
        setTimeout(() => {
          log('timeout over');
          this.autoUpdateManager.quitAndInstall();
        }, 200);
      }
    } catch (err) {
      logFatal(err);
    }
  }

  /**
   * Called when the 'window-all-closed' event is emitted.
   */
  onAllWindowsClosed() {
    // Quit the app if all windows are closed
    log('all windows closed');
    _electron.app.quit();
  }

  /**
   * Called when the 'activate' event is emitted.
   */
  onActivate(event, hasVisibleWindows) {
    // Reopen the main window on dock clicks (OS X)
    log('activate app, hasVisibleWindows', hasVisibleWindows);
    if (!hasVisibleWindows && this.mainWindowManager) {
      this.mainWindowManager.showOrCreate();
    }
  }
}
var _default = exports.default = AppListenersManager;