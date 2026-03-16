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
var _default = exports.default = {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: '&Reload',
    accelerator: 'CmdOrCtrl+R',
    needsWindow: true,
    click: _expressions.default.reloadWindow()
  }, {
    label: 'Re&set',
    accelerator: 'CmdOrCtrl+Alt+R',
    needsWindow: true,
    click: _expressions.default.resetWindow()
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Float on Top',
    accelerator: 'CmdOrCtrl+Alt+T',
    needsWindow: true,
    click: _expressions.default.floatOnTop(_expressions.default.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Close with &Escape Key',
    click: _expressions.default.setPref('close-with-esc', _expressions.default.key('checked')),
    parse: _expressions.default.setLocal('checked', _expressions.default.pref('close-with-esc'))
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    click: _expressions.default.setPref('links-in-browser', _expressions.default.key('checked')),
    parse: _expressions.default.setLocal('checked', _expressions.default.pref('links-in-browser'))
  }, {
    type: 'checkbox',
    label: '&Notifications Badge in ' + (_platform.default.isWindows ? 'Taskbar' : 'Dock'),
    needsWindow: true,
    click: _expressions.default.all(_expressions.default.setPref('show-notifications-badge', _expressions.default.key('checked')), _platform.default.isWindows ? _expressions.default.hideTaskbarBadge(_expressions.default.key('checked')) : _expressions.default.hideDockBadge(_expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('show-notifications-badge')))
  }, {
    type: 'checkbox',
    label: 'Accept First &Click',
    needsWindow: true,
    click: _expressions.default.all(_expressions.default.setPref('accept-first-mouse', _expressions.default.key('checked')), _expressions.default.restartApp()),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('accept-first-mouse')))
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Show in &Tray',
    allow: _platform.default.isNonDarwin,
    click: _expressions.default.all(_expressions.default.showInTray(_expressions.default.key('checked')), _expressions.default.setPref('show-tray', _expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('show-tray')))
  }, {
    id: 'show-tray',
    type: 'checkbox',
    label: 'Show in Menu Bar',
    allow: _platform.default.isDarwin,
    click: _expressions.default.all(_expressions.default.showInTray(_expressions.default.key('checked')), _expressions.default.updateSibling('show-dock', 'enabled', _expressions.default.key('checked')), _expressions.default.updateMenuItem('tray', 'show-tray')(_expressions.default.key('checked'))(checked => _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.val(checked)), _expressions.default.updateSibling('show-dock', 'enabled', _expressions.default.val(checked)))), _expressions.default.setPref('show-tray', _expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('show-tray')), _expressions.default.setLocal('enabled', _expressions.default.pref('show-dock')))
  }, {
    id: 'show-dock',
    type: 'checkbox',
    label: 'Show in Dock',
    allow: _platform.default.isDarwin,
    click: _expressions.default.all(_expressions.default.showInDock(_expressions.default.key('checked')), _expressions.default.updateSibling('show-tray', 'enabled', _expressions.default.key('checked')), _expressions.default.updateMenuItem('tray', 'show-dock')(_expressions.default.key('checked'))(checked => _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.val(checked)), _expressions.default.updateSibling('show-tray', 'enabled', _expressions.default.val(checked)))), _expressions.default.setPref('show-dock', _expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('show-dock')), _expressions.default.setLocal('enabled', _expressions.default.pref('show-tray')), _expressions.default.showInDock(_expressions.default.key('checked')))
  }, {
    type: 'separator',
    allow: _platform.default.isDarwin
  }, {
    role: 'minimize',
    allow: _platform.default.isDarwin
  }, {
    role: 'zoom',
    allow: _platform.default.isDarwin
  }, {
    role: 'close',
    allow: _platform.default.isDarwin
  }]
};