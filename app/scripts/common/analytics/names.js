if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _keymirror = _interopRequireDefault(require("keymirror"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = (0, _keymirror.default)({
  // Logs / Exception
  'Error': null,
  'Fatal Error': null,
  // Menu / Open Link
  'Gitter Chat Link': null,
  'Write Review Link': null,
  'Suggest Feature Link': null,
  'Report Issue Link': null,
  'Contact Developer Email Link': null,
  'Contact Developer Twitter Link': null,
  'Donate PayPal Link': null,
  'Donate Bitcoin Link': null,
  'FAQ Link': null,
  // Menu / Open Dialog
  'Open Dialog': null
});