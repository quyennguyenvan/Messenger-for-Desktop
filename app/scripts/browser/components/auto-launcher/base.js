if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = _interopRequireDefault(require("events"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class BaseAutoLauncher extends _events.default {
  async enable() {
    throw new Error('Not implemented');
  }
  async disable() {
    throw new Error('Not implemented');
  }
  async isEnabled() {
    throw new Error('Not implemented');
  }
}
var _default = exports.default = BaseAutoLauncher;