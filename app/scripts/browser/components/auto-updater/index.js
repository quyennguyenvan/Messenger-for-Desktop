if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _platform = _interopRequireDefault(require("common/utils/platform"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
let impl = null;
if (_platform.default.isLinux) {
  impl = require('browser/components/auto-updater/impl-linux').default;
} else if (_platform.default.isWindows && global.options.portable) {
  impl = require('browser/components/auto-updater/impl-win32-portable').default;
} else {
  impl = require('electron').autoUpdater;
}
var _default = exports.default = impl;