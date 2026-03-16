if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("browser/components/native-notifier/base"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class LinuxNativeNotifier extends _base.default {}
var _default = exports.default = LinuxNativeNotifier;