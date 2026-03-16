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
  label: 'Theme',
  submenu: Object.keys(global.manifest.themes).map((themeId, index) => ({
    type: 'radio',
    label: global.manifest.themes[themeId],
    theme: themeId,
    needsWindow: true,
    click: _expressions.default.all(_expressions.default.themeCss(_expressions.default.key('theme'), css => _expressions.default.sendToWebView('apply-theme', _expressions.default.val(css))), _expressions.default.setPref('theme', _expressions.default.key('theme'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.eq(_expressions.default.pref('theme'), _expressions.default.key('theme'))))
  }))
};