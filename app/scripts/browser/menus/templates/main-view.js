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
  label: '&View',
  submenu: [{
    label: 'Zoom In',
    accelerator: 'CmdOrCtrl+plus',
    needsWindow: true,
    click: _expressions.default.all(_expressions.default.setPref('zoom-level', _expressions.default.sum(_expressions.default.pref('zoom-level'), _expressions.default.val(+0.25))), _expressions.default.sendToWebContents('zoom-level', _expressions.default.pref('zoom-level')))
  }, {
    label: 'Zoom Out',
    accelerator: 'CmdOrCtrl+-',
    needsWindow: true,
    click: _expressions.default.all(_expressions.default.setPref('zoom-level', _expressions.default.sum(_expressions.default.pref('zoom-level'), _expressions.default.val(-0.25))), _expressions.default.sendToWebContents('zoom-level', _expressions.default.pref('zoom-level')))
  }, {
    label: 'Reset Zoom',
    accelerator: 'CmdOrCtrl+0',
    needsWindow: true,
    click: _expressions.default.all(_expressions.default.sendToWebContents('zoom-level', _expressions.default.val(0)), _expressions.default.unsetPref('zoom-level'))
  }, {
    type: 'separator'
  }, {
    needsWindow: true,
    role: 'togglefullscreen'
  }, {
    label: 'Toggle &Developer Tools',
    needsWindow: true,
    click: _expressions.default.toggleDevTools()
  }, {
    label: 'Toggle WebView &Dev Tools',
    needsWindow: true,
    click: _expressions.default.toggleWebViewDevTools()
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Auto Hide &Menu Bar',
    accelerator: 'Alt+Ctrl+B',
    needsWindow: true,
    allow: _platform.default.isNonDarwin,
    click: _expressions.default.all(_expressions.default.setPref('auto-hide-menubar', _expressions.default.key('checked')), _expressions.default.autoHideMenuBar(_expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('auto-hide-menubar')))
  }, {
    type: 'separator'
  }, {
    //   type: 'checkbox',
    //   label: 'Auto Hide Sidebar',
    //   needsWindow: true,
    //   click: $.all(
    //     $.styleCss('auto-hide-sidebar', (css) =>
    //       $.sendToWebView('apply-sidebar-auto-hide', $.key('checked'), $.val(css))
    //     ),
    //     $.setPref('sidebar-auto-hide', $.key('checked'))
    //   ),
    //   parse: $.all(
    //     $.setLocal('checked', $.pref('sidebar-auto-hide'))
    //   )
    // }, {
    //   type: 'separator'
    // }, {
    label: 'N&ew Conversation',
    accelerator: 'CmdOrCtrl+N',
    needsWindow: true,
    click: _expressions.default.sendToWebView('new-conversation')
  }, {
    label: 'Search &Chats',
    accelerator: 'CmdOrCtrl+F',
    needsWindow: true,
    click: _expressions.default.sendToWebView('search-chats')
  }, {
    type: 'separator'
  }, {
    label: '&Next Conversation',
    accelerator: 'CmdOrCtrl+Down',
    needsWindow: true,
    click: _expressions.default.sendToWebView('switch-conversation-next')
  }, {
    label: '&Previous Conversation',
    accelerator: 'CmdOrCtrl+Up',
    needsWindow: true,
    click: _expressions.default.sendToWebView('switch-conversation-previous')
  }, {
    label: 'Switch to Conversation',
    submenu: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => ({
      label: 'Conversation ' + num,
      accelerator: 'CmdOrCtrl+' + num,
      needsWindow: true,
      click: _expressions.default.sendToWebView('switch-conversation-num', _expressions.default.val(num))
    }))
  }]
};