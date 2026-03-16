if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _expressions = _interopRequireDefault(require("browser/menus/expressions"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = [{
  label: 'Reset Window',
  click: _expressions.default.resetWindow()
}, {
  type: 'separator'
}, {
  id: 'show-tray',
  type: 'checkbox',
  label: 'Show in Menu Bar',
  allow: _platform.default.isDarwin,
  click: _expressions.default.all(_expressions.default.showInTray(_expressions.default.key('checked')), _expressions.default.updateSibling('show-dock', 'enabled', _expressions.default.key('checked')), _expressions.default.updateMenuItem('main', 'show-tray')(_expressions.default.key('checked'))(checked => _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.val(checked)), _expressions.default.updateSibling('show-dock', 'enabled', _expressions.default.val(checked)))), _expressions.default.setPref('show-tray', _expressions.default.key('checked'))),
  parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('show-tray')), _expressions.default.setLocal('enabled', _expressions.default.pref('show-dock')))
}, {
  id: 'show-dock',
  type: 'checkbox',
  label: 'Show in Dock',
  allow: _platform.default.isDarwin,
  click: _expressions.default.all(_expressions.default.showInDock(_expressions.default.key('checked')), _expressions.default.updateSibling('show-tray', 'enabled', _expressions.default.key('checked')), _expressions.default.updateMenuItem('main', 'show-dock')(_expressions.default.key('checked'))(checked => _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.val(checked)), _expressions.default.updateSibling('show-tray', 'enabled', _expressions.default.val(checked)))), _expressions.default.setPref('show-dock', _expressions.default.key('checked'))),
  parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('show-dock')), _expressions.default.setLocal('enabled', _expressions.default.pref('show-tray')))
}, {
  type: 'separator',
  allow: _platform.default.isDarwin
}, {
  label: 'Show ' + global.manifest.productName,
  click: _expressions.default.showWindow()
}, {
  label: 'Quit ' + global.manifest.productName,
  click: _expressions.default.appQuit()
}];