if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _launchd = _interopRequireDefault(require("launchd.plist"));
var _fsExtraPromise = _interopRequireDefault(require("fs-extra-promise"));
var _electron = require("electron");
var _path = _interopRequireDefault(require("path"));
var _base = _interopRequireDefault(require("browser/components/auto-launcher/base"));
var _files = _interopRequireDefault(require("common/utils/files"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const plistName = global.manifest.darwin.bundleId + '.plist';
const plistPath = _path.default.join(_electron.app.getPath('home'), 'Library', 'LaunchAgents', plistName);
class DarwinAutoLauncher extends _base.default {
  async enable() {
    log('enabling darwin auto-launch');
    log('creating login plist');
    await _files.default.replaceFile(plistPath, () => _fsExtraPromise.default.writeFileAsync(plistPath, this.buildPlist(), 'utf8'));
  }
  async disable() {
    log('disabling linux auto-launch');
    log('removing login plist');
    await _fsExtraPromise.default.removeAsync(plistPath);
  }
  async isEnabled() {
    log('checking darwin auto-launch');
    await _files.default.isFileExists(plistPath);
  }
  buildPlist() {
    const plist = new _launchd.default();
    plist.setLabel(global.manifest.darwin.bundleId);
    plist.setProgram(_electron.app.getPath('exe'));
    plist.setProgramArgs(['--os-startup']);
    plist.setRunAtLoad(true);
    return plist.build();
  }
}
var _default = exports.default = DarwinAutoLauncher;