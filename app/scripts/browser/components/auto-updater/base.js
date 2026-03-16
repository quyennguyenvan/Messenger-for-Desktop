if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = _interopRequireDefault(require("events"));
var _needle = _interopRequireDefault(require("needle"));
var _electron = require("electron");
var _semver = _interopRequireDefault(require("semver"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class BaseAutoUpdater extends _events.default {
  setFeedURL(latestReleaseUrl) {
    log('set feed url', latestReleaseUrl);
    this.latestReleaseUrl = latestReleaseUrl;
  }
  checkForUpdates(url) {
    log('checking for update', url);
    this.emit('checking-for-update');
    _needle.default.get(url, {
      json: true
    }, (err, response, json) => {
      if (err) {
        log('update error while getting json', err);
        this.emit('error', err);
        return;
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        log('update error statusCode', response.statusCode);
        this.emit('error', new Error(response.statusMessage));
        return;
      }
      const newVersion = json.version;
      const newVersionExists = _semver.default.gt(newVersion, global.manifest.version);
      const downloadUrl = json.url;
      if (newVersionExists) {
        log('update available', newVersion, downloadUrl);
        this.emit('update-available', newVersion, downloadUrl);
      } else {
        log('app version up to date', global.manifest.version);
        this.emit('update-not-available');
      }
    });
  }
  quitAndInstall() {
    log('quit and install');
    _electron.app.quit();
  }
}
var _default = exports.default = BaseAutoUpdater;