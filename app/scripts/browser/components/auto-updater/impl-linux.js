if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _url = _interopRequireDefault(require("url"));
var _base = _interopRequireDefault(require("browser/components/auto-updater/base"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AutoUpdater extends _base.default {
  checkForUpdates() {
    if (!this.latestReleaseUrl) {
      this.emit('error', new Error('Latest release URL is not set'));
      return;
    }
    const packageType = global.manifest.distrib.split(':')[1];
    let arch = null;
    if (packageType === 'deb') {
      arch = process.arch === 'ia32' ? 'i386' : 'amd64';
    } else {
      arch = process.arch === 'ia32' ? 'i386' : 'x86_64';
    }
    const urlObj = _url.default.parse(this.latestReleaseUrl);
    urlObj.query = urlObj.query || {};
    urlObj.query.pkg = packageType;
    urlObj.query.arch = arch;
    const url = _url.default.format(urlObj);
    super.checkForUpdates(url);
  }
}
var _default = exports.default = new AutoUpdater();