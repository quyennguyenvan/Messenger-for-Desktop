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
  label: 'Privacy',
  submenu: [{
    type: 'checkbox',
    label: '&Report App Stats and Crashes',
    click: _expressions.default.setPref('analytics-track', _expressions.default.key('checked')),
    parse: _expressions.default.setLocal('checked', _expressions.default.pref('analytics-track'))
  }, {
    id: 'block-seen-typing',
    type: 'checkbox',
    label: '&Block Seen and Typing Indicators',
    click: _expressions.default.all(_expressions.default.setPref('block-seen-typing', _expressions.default.key('checked')), _expressions.default.blockSeenTyping(_expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('block-seen-typing')))
  }]
};