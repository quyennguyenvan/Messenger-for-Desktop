if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _expressions = _interopRequireDefault(require("browser/menus/expressions"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'Open App Website',
    click: _expressions.default.openUrl('https://messengerfordesktop.com/')
  }, {
    label: 'Send Feedback',
    click: _expressions.default.openUrl('https://aluxian.typeform.com/to/sr2gEc')
  }]
};