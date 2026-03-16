if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fsExtraPromise = _interopRequireDefault(require("fs-extra-promise"));
var _electron = require("electron");
var _path = _interopRequireDefault(require("path"));
var _base = _interopRequireDefault(require("browser/components/auto-launcher/base"));
var _files = _interopRequireDefault(require("common/utils/files"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const autoStartDir = _path.default.join(_electron.app.getPath('home'), '.config', 'autostart');
const desktopFilePath = _path.default.join(autoStartDir, global.manifest.name + '.desktop');
const initialDesktopPath = _path.default.join(_electron.app.getAppPath(), 'startup.desktop');
class LinuxAutoLauncher extends _base.default {
  async enable() {
    log('enabling linux auto-launch');
    log('creating autolaunch .desktop');
    await _files.default.replaceFile(desktopFilePath, () => _fsExtraPromise.default.copyAsync(initialDesktopPath, desktopFilePath));
  }
  async disable() {
    log('disabling linux auto-launch');
    log('removing autolaunch .desktop');
    await _fsExtraPromise.default.removeAsync(desktopFilePath);
  }
  async isEnabled() {
    log('checking linux auto-launch');
    await _files.default.isFileExists(desktopFilePath);
  }
}
var _default = exports.default = LinuxAutoLauncher;