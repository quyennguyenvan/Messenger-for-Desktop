if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _promisifyEs = _interopRequireDefault(require("promisify-es6"));
var _winreg = _interopRequireDefault(require("winreg"));
var _filePaths = _interopRequireDefault(require("common/utils/file-paths"));
var _base = _interopRequireDefault(require("browser/components/auto-launcher/base"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const REG_KEY = new _winreg.default({
  hive: _winreg.default.HKCU,
  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});
const setAsync = (0, _promisifyEs.default)(REG_KEY.set, {
  context: REG_KEY
});
const removeAsync = (0, _promisifyEs.default)(REG_KEY.remove, {
  context: REG_KEY
});
const keyExistsAsync = (0, _promisifyEs.default)(REG_KEY.keyExists, {
  context: REG_KEY
});
class Win32AutoLauncher extends _base.default {
  async enable() {
    const updateExePath = _filePaths.default.getSquirrelUpdateExePath();
    const cmd = ['"' + updateExePath + '"', '--processStart', '"' + global.manifest.productName + '.exe"', '--process-start-args', '"--os-startup"'].join(' ');
    log('setting registry key for', global.manifest.productName, 'value', cmd);
    await setAsync(global.manifest.productName, _winreg.default.REG_SZ, cmd);
  }
  async disable() {
    log('removing registry key for', global.manifest.productName);
    try {
      await removeAsync(global.manifest.productName);
    } catch (err) {
      const notFoundMsg = 'The system was unable to find the specified registry key or value.';
      const notFoundErr = err.message && err.message.includes(notFoundMsg);
      const knownError = notFoundErr;
      if (!knownError) {
        throw err;
      }
    }
  }
  async isEnabled() {
    log('querying registry key for', global.manifest.productName);
    const exists = await keyExistsAsync(global.manifest.productName);
    log('registry value for', global.manifest.productName, 'is', exists ? 'enabled' : 'disabled');
    return exists;
  }
}
var _default = exports.default = Win32AutoLauncher;