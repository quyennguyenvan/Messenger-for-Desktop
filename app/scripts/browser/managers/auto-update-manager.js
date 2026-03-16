if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _electron = require("electron");
var _events = _interopRequireDefault(require("events"));
var _keymirror = _interopRequireDefault(require("keymirror"));
var _autoUpdater = _interopRequireDefault(require("browser/components/auto-updater"));
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const STATES = (0, _keymirror.default)({
  IDLE: null,
  UPDATE_CHECKING: null,
  UPDATE_AVAILABLE: null,
  UPDATE_DOWNLOADED: null
});
class AutoUpdateManager extends _events.default {
  constructor(mainWindowManager) {
    super();
    this.mainWindowManager = mainWindowManager;
    this.enabled = !global.options.mas && _prefs.default.get('updates-auto-check');
    this.state = STATES.IDLE;
    this.states = STATES;
    this.latestVersion = null;
    this.latestDownloadUrl = null;
  }
  init() {
    log('starting auto updater');
    try {
      this.initFeedUrl();
      this.initErrorListener();
      this.initStateListeners();
      this.initVersionListener();
    } catch (err) {
      const isSignatureErr = err.message === 'Could not get code signature for running application';
      const isKnownError = isSignatureErr;
      if (global.manifest.dev && isKnownError) {
        logError(err);
      } else {
        throw err;
      }
    }
  }
  initFeedUrl() {
    let feedUrl = global.manifest.updater.urls[process.platform].replace(/%CURRENT_VERSION%/g, global.manifest.version).replace(/%CHANNEL%/g, _prefs.default.get('updates-channel'));
    if (global.options.portable) {
      feedUrl += '/portable';
    }
    log('updater feed url:', feedUrl);
    _autoUpdater.default.setFeedURL(feedUrl);
  }
  initErrorListener() {
    _autoUpdater.default.on('error', err => {
      log('auto updater error');
      logError(err, true);
    });
  }
  initStateListeners() {
    const eventToStateMap = {
      'error': STATES.IDLE,
      'checking-for-update': STATES.UPDATE_CHECKING,
      'update-available': STATES.UPDATE_AVAILABLE,
      'update-not-available': STATES.IDLE,
      'update-downloaded': STATES.UPDATE_DOWNLOADED
    };
    for (let [eventName, state] of Object.entries(eventToStateMap)) {
      _autoUpdater.default.on(eventName, () => {
        this.state = state;
      });
    }
  }
  initVersionListener() {
    _autoUpdater.default.on('update-available', (newVersion, downloadUrl) => {
      this.latestVersion = newVersion;
      this.latestDownloadUrl = downloadUrl;
    });
  }
  handleMenuCheckForUpdate(informUser) {
    this.checkForUpdate(informUser);
  }
  handleMenuUpdateAvailable() {
    this.onCheckUpdateAvailable(this.latestVersion, this.latestDownloadUrl);
  }
  handleMenuUpdateDownloaded() {
    this.quitAndInstall();
  }
  setAutoCheck(check) {
    if (this.enabled === check) {
      log('update checker already', check ? 'enabled' : 'disabled');
      return; // same state
    }
    this.enabled = !global.options.mas && check;
    if (this.enabled) {
      // disabled -> enabled
      log('enabling auto update checker');
      this.scheduleUpdateChecks();
    } else if (this.scheduledCheckerId) {
      // enabled -> disabled
      log('disabling auto update checker');
      clearInterval(this.scheduledCheckerId);
      this.scheduledCheckerId = null;
    }
  }
  onCheckUpdateAvailable(newVersion, downloadUrl) {
    log('onCheckUpdateAvailable', 'newVersion:', newVersion, 'downloadUrl:', downloadUrl);
    if (_platform.default.isLinux) {
      _electron.dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available: ' + newVersion,
        detail: 'Use your package manager to update, or click Download to get the new package.',
        buttons: ['OK', 'Download']
      }, function (response) {
        if (response === 1) {
          log('user clicked Download, opening url', downloadUrl);
          _electron.shell.openExternal(downloadUrl || global.manifest.homepage);
        }
      });
    } else if (_platform.default.isWindows && global.options.portable) {
      _electron.dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available: ' + newVersion,
        detail: 'Click Download to get a portable zip with the new version.',
        buttons: ['OK', 'Download']
      }, function (response) {
        if (response === 1) {
          log('user clicked Download, opening url', downloadUrl);
          _electron.shell.openExternal(downloadUrl || global.manifest.homepage);
        }
      });
    } else {
      _electron.dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available.',
        detail: 'It will start downloading in the background.',
        buttons: ['OK']
      }, function () {});
    }
  }
  onCheckUpdateNotAvailable() {
    log('onCheckUpdateNotAvailable');
    _electron.dialog.showMessageBox({
      type: 'info',
      message: 'No update available.',
      detail: 'You are using the latest version: ' + global.manifest.version,
      buttons: ['OK']
    }, function () {});
  }
  onCheckError(err) {
    log('onCheckError:', err);
    _electron.dialog.showMessageBox({
      type: 'error',
      message: 'Error while checking for update.',
      detail: global.manifest.productName + ' could not connect to the updates server.' + ' Please make sure you have a working internet connection and try again.' + '\n\nERR: ' + (err.message || '').substr(0, 1024),
      buttons: ['OK']
    }, function () {});
  }
  scheduleUpdateChecks() {
    const checkInterval = 1000 * 60 * 60 * 4; // 4 hours
    log('scheduling update checks every', checkInterval, 'ms');
    this.scheduledCheckerId = setInterval(this.checkForUpdate.bind(this), checkInterval);
    this.checkForUpdate();
  }
  checkForUpdate(informUser) {
    log('checking for update...');
    _autoUpdater.default.checkForUpdates();
    if (informUser) {
      const onCheck = {};
      const removeListeners = () => {
        _autoUpdater.default.removeListener('update-available', onCheck.updateAvailable);
        _autoUpdater.default.removeListener('update-not-available', onCheck.updateNotAvailable);
        _autoUpdater.default.removeListener('error', onCheck.error);
      };
      onCheck.updateAvailable = () => {
        this.onCheckUpdateAvailable.apply(this, arguments);
        removeListeners();
      };
      onCheck.updateNotAvailable = () => {
        this.onCheckUpdateNotAvailable.apply(this, arguments);
        removeListeners();
      };
      onCheck.error = () => {
        this.onCheckError.apply(this, arguments);
        removeListeners();
      };
      _autoUpdater.default.once('update-available', onCheck.updateAvailable);
      _autoUpdater.default.once('update-not-available', onCheck.updateNotAvailable);
      _autoUpdater.default.once('error', onCheck.error);
    }
  }
  quitAndInstall() {
    this.mainWindowManager.updateInProgress = true;
    _autoUpdater.default.quitAndInstall();
  }
}
var _default = exports.default = AutoUpdateManager;