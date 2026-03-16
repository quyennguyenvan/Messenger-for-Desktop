if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("browser/components/auto-updater/base"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AutoUpdater extends _base.default {
  checkForUpdates() {
    if (!this.latestReleaseUrl) {
      this.emit('error', new Error('Latest release URL is not set'));
      return;
    }
    super.checkForUpdates(this.latestReleaseUrl);
  }
}
var _default = exports.default = new AutoUpdater();