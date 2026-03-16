if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _spellchecker = require("common/utils/spellchecker");
var _languageCodes = _interopRequireDefault(require("common/utils/language-codes"));
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
var _expressions = _interopRequireDefault(require("browser/menus/expressions"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const spellCheckerLanguage = _prefs.default.get('spell-checker-language');
const availableLanguages = (0, _spellchecker.getAvailableDictionaries)().map(langCode => {
  return {
    code: langCode,
    name: _languageCodes.default[langCode] || _languageCodes.default[langCode.replace('-', '_')] || _languageCodes.default[langCode.replace('-', '_').split('_')[0]]
  };
}).filter(langObj => langObj.name).filter((langObj, index, arr) => {
  for (let i = index + 1; i < arr.length; i++) {
    if (arr[i].name === langObj.name) {
      return false;
    }
  }
  return true;
}).sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
});
var _default = exports.default = {
  label: 'Edit',
  submenu: [{
    allow: _platform.default.isDarwin,
    role: 'undo'
  }, {
    allow: _platform.default.isDarwin,
    role: 'redo'
  }, {
    type: 'separator',
    allow: _platform.default.isDarwin
  }, {
    allow: _platform.default.isDarwin,
    role: 'cut'
  }, {
    allow: _platform.default.isDarwin,
    role: 'copy'
  }, {
    allow: _platform.default.isDarwin,
    role: 'paste'
  }, {
    allow: _platform.default.isDarwin,
    role: 'delete'
  }, {
    allow: _platform.default.isDarwin,
    role: 'selectall'
  }, {
    type: 'separator',
    allow: _platform.default.isDarwin
  }, {
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
    accelerator: 'CmdOrCtrl+Alt+S',
    needsWindow: true,
    click: _expressions.default.all(_expressions.default.sendToWebView('spell-checker', _expressions.default.key('checked'), _expressions.default.pref('spell-checker-auto-correct'), _expressions.default.pref('spell-checker-language')), _expressions.default.updateSibling('spell-checker-auto-correct', 'enabled', _expressions.default.key('checked')), _expressions.default.updateSibling('spell-checker-language', 'enabled', _expressions.default.key('checked')), _expressions.default.setPref('spell-checker-check', _expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('checked', _expressions.default.pref('spell-checker-check')))
  }, {
    id: 'spell-checker-auto-correct',
    type: 'checkbox',
    label: '&Auto Correct Spelling Mistakes',
    needsWindow: true,
    allow: false,
    click: _expressions.default.all(_expressions.default.sendToWebView('spell-checker', _expressions.default.pref('spell-checker-check'), _expressions.default.key('checked'), _expressions.default.pref('spell-checker-language')), _expressions.default.setPref('spell-checker-auto-correct', _expressions.default.key('checked'))),
    parse: _expressions.default.all(_expressions.default.setLocal('enabled', _expressions.default.pref('spell-checker-check')), _expressions.default.setLocal('checked', _expressions.default.pref('spell-checker-auto-correct')))
  }, {
    id: 'spell-checker-language',
    label: 'Spell Checker Language',
    submenu: availableLanguages.map(lang => ({
      type: 'radio',
      label: lang.name,
      langCode: lang.code,
      checked: spellCheckerLanguage === lang.code,
      needsWindow: true,
      click: _expressions.default.all(_expressions.default.ifTrue(_expressions.default.pref('spell-checker-check'), _expressions.default.sendToWebView('spell-checker', _expressions.default.pref('spell-checker-check'), _expressions.default.pref('spell-checker-auto-correct'), _expressions.default.key('langCode'))), _expressions.default.setPref('spell-checker-language', _expressions.default.key('langCode')))
    }))
  }]
};