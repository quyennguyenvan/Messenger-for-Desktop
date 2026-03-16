if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _electron = require("electron");
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _urls = _interopRequireDefault(require("common/utils/urls"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function create(params, browserWindow) {
  const webContents = browserWindow.webContents;
  const menu = new _electron.Menu();
  if (_platform.default.isDarwin && params.selectionText) {
    menu.append(new _electron.MenuItem({
      label: 'Look Up "' + params.selectionText + '"',
      click: () => webContents.send('call-webview-method', 'showDefinitionForSelection')
    }));
  }
  if (params.isEditable && params.misspelledWord) {
    const corrections = Array.isArray(params.dictionarySuggestions) ? params.dictionarySuggestions : [];
    const items = [];

    // add correction suggestions
    for (let i = 0; i < corrections.length && i < 5; i++) {
      items.push(new _electron.MenuItem({
        label: 'Correct: ' + corrections[i],
        click: () => webContents.send('call-webview-method', 'replaceMisspelling', corrections[i])
      }));
    }

    // Hunspell doesn't remember these, so skip this item
    // Otherwise, offer to add the word to the dictionary
    if (!_platform.default.isLinux && !params.isWindows7) {
      items.push(new _electron.MenuItem({
        label: 'Add to Dictionary',
        click: () => {
          webContents.send('fwd-webview', 'add-selection-to-dictionary');
          webContents.send('call-webview-method', 'replaceMisspelling', params.misspelledWord);
        }
      }));
    }

    // prepend separator and then add items
    if (items.length) {
      menu.append(new _electron.MenuItem({
        type: 'separator'
      }));
      for (const item of items) {
        menu.append(item);
      }
    }
  }
  if (params.isEditable) {
    menu.append(new _electron.MenuItem({
      type: 'separator'
    }));
    menu.append(new _electron.MenuItem({
      label: 'Undo',
      enabled: params.editFlags.canUndo,
      click: () => webContents.send('call-webview-method', 'undo')
    }));
    menu.append(new _electron.MenuItem({
      label: 'Redo',
      enabled: params.editFlags.canRedo,
      click: () => webContents.send('call-webview-method', 'redo')
    }));
  }
  if (params.selectionText || params.isEditable) {
    menu.append(new _electron.MenuItem({
      type: 'separator'
    }));
    menu.append(new _electron.MenuItem({
      label: 'Cut',
      enabled: params.editFlags.canCut,
      click: () => webContents.send('call-webview-method', 'cut')
    }));
    menu.append(new _electron.MenuItem({
      label: 'Copy',
      enabled: params.editFlags.canCopy,
      click: () => webContents.send('call-webview-method', 'copy')
    }));
    menu.append(new _electron.MenuItem({
      label: 'Paste',
      enabled: params.editFlags.canPaste,
      click: () => webContents.send('call-webview-method', 'pasteAndMatchStyle')
    }));
    menu.append(new _electron.MenuItem({
      label: 'Select All',
      enabled: params.editFlags.canSelectAll,
      click: () => webContents.send('call-webview-method', 'selectAll')
    }));
  }
  if (params.linkURL) {
    menu.append(new _electron.MenuItem({
      type: 'separator'
    }));
    menu.append(new _electron.MenuItem({
      label: 'Copy Link Text',
      enabled: !!params.linkText,
      click: () => _electron.clipboard.writeText(params.linkText)
    }));
    menu.append(new _electron.MenuItem({
      label: 'Copy Link Address',
      click: () => _electron.clipboard.writeText(_urls.default.skipFacebookRedirect(params.linkURL))
    }));
  }
  return menu;
}
var _default = exports.default = {
  create
};