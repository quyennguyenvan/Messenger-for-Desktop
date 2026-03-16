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
  label: _platform.default.isDarwin ? global.manifest.productName : '&App',
  submenu: [{
    label: 'About ' + global.manifest.productName,
    click: _expressions.default.showCustomAboutDialog()
  }, {
    type: 'checkbox',
    label: 'Switch to Workplace Messenger',
    click: _expressions.default.all(_expressions.default.setPref('switch-workplace', _expressions.default.key('checked')), _expressions.default.reloadWindow()),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('switch-workplace')))
  }, {
    label: _platform.default.isDarwin ? 'Preferences...' : 'Settings',
    accelerator: 'CmdOrCtrl+,',
    click: _expressions.default.sendToWebView('open-preferences-modal'),
    needsWindow: true
  }, {
    type: 'separator',
    allow: !global.options.mas
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for &Update...',
    allow: !global.options.mas,
    click: _expressions.default.cfuCheckForUpdate(true)
  }, {
    id: 'cfu-checking-for-update',
    label: 'Checking for &Update...',
    allow: !global.options.mas,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-available',
    label: 'Download &Update...',
    allow: _platform.default.isNonDarwin && (_platform.default.isLinux || global.options.portable),
    visible: false,
    click: _expressions.default.cfuUpdateAvailable()
  }, {
    id: 'cfu-update-available',
    label: 'Downloading &Update...',
    allow: !global.options.mas && !_platform.default.isLinux && !global.options.portable,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-downloaded',
    label: 'Restart and Install &Update...',
    allow: !global.options.mas,
    visible: false,
    click: _expressions.default.cfuUpdateDownloaded()
  }, {
    label: 'Updates Release Channel',
    allow: !global.options.mas,
    submenu: ['Stable', 'Beta', 'Dev'].map(channelName => ({
      type: 'radio',
      label: channelName,
      channel: channelName.toLowerCase(),
      click: _expressions.default.all(_expressions.default.setPref('updates-channel', _expressions.default.key('channel')), _expressions.default.resetAutoUpdaterUrl(), _expressions.default.cfuCheckForUpdate(false)),
      parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.eq(_expressions.default.pref('updates-channel'), _expressions.default.key('channel'))))
    }))
  }, {
    type: 'checkbox',
    label: 'Check for Update Automatically',
    allow: !global.options.mas,
    click: _expressions.default.all(_expressions.default.checkForUpdateAuto(_expressions.default.key('checked')), _expressions.default.setPref('updates-auto-check', _expressions.default.key('checked'))),
    parse: _expressions.default.setLocal('checked', _expressions.default.pref('updates-auto-check'))
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Launch on OS Startup',
    allow: !global.options.mas && !global.options.portable,
    click: _expressions.default.all(_expressions.default.launchOnStartup(_expressions.default.key('checked')), _expressions.default.updateSibling('startup-hidden', 'enabled', _expressions.default.key('checked')), _expressions.default.setPref('launch-startup', _expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('launch-startup')), _expressions.default.updateSibling('startup-hidden', 'enabled', _expressions.default.key('checked')))
  }, {
    id: 'startup-hidden',
    type: 'checkbox',
    label: 'Start &Hidden on Startup',
    allow: !global.options.mas && !global.options.portable,
    click: _expressions.default.setPref('launch-startup-hidden', _expressions.default.key('checked')),
    parse: _expressions.default.setLocal('checked', _expressions.default.pref('launch-startup-hidden'))
  }, {
    type: 'separator'
  }, {
    label: 'Restart in Debug Mode',
    allow: !global.options.debug,
    click: _expressions.default.restartInDebugMode()
  }, {
    label: 'Running in Debug Mode',
    allow: global.options.debug,
    enabled: false
  }, {
    label: 'Open Debug Log...',
    enabled: global.options.debug,
    click: _expressions.default.openDebugLog()
  }, {
    type: 'separator'
  }, {
    label: '&Quit',
    accelerator: 'Ctrl+Q',
    allow: _platform.default.isNonDarwin,
    click: _expressions.default.appQuit()
  }, {
    role: 'services',
    submenu: [],
    allow: _platform.default.isDarwin
  }, {
    type: 'separator',
    allow: _platform.default.isDarwin
  }, {
    role: 'hide',
    allow: _platform.default.isDarwin
  }, {
    role: 'hideothers',
    allow: _platform.default.isDarwin
  }, {
    role: 'unhide',
    allow: _platform.default.isDarwin
  }, {
    type: 'separator',
    allow: _platform.default.isDarwin
  }, {
    role: 'quit',
    allow: _platform.default.isDarwin
  }]
};