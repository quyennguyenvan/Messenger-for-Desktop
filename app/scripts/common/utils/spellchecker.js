if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAvailableDictionaries = getAvailableDictionaries;
exports.getDictionaryPath = getDictionaryPath;
exports.getDictionarySearchPaths = getDictionarySearchPaths;
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _app = _interopRequireDefault(require("common/electron/app"));
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _files = _interopRequireDefault(require("common/utils/files"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
let hunspellDictionarySearchPaths = null;
let availableDictionaries = null;
function statSyncNoException(p) {
  try {
    return _fs.default.statSync(p);
  } catch (e) {
    return null;
  }
}
function getDictionarySearchPaths() {
  if (hunspellDictionarySearchPaths) {
    return hunspellDictionarySearchPaths;
  }
  let searchPaths = [_path.default.join(_app.default.getAppPath(), 'dicts'),
  // Legacy path for the deprecated `spellchecker` native module.
  // Kept for backwards-compatibility when users have their own dictionaries bundled.
  _path.default.join(_app.default.getAppPath(), 'node_modules', 'spellchecker', 'vendor', 'hunspell_dictionaries')];

  // Special case being in an asar archive
  searchPaths = searchPaths.map(searchPath => {
    if (searchPath.includes('.asar' + _path.default.sep)) {
      const unpacked = searchPath.replace('.asar' + _path.default.sep, '.asar.unpacked' + _path.default.sep);
      if (statSyncNoException(unpacked)) {
        return unpacked;
      }
    }
    return searchPath;
  });
  if (_platform.default.isLinux) {
    searchPaths = searchPaths.concat(['/usr/share/hunspell', '/usr/share/myspell', '/usr/share/myspell/dicts', '/Library/Spelling']);
  }
  hunspellDictionarySearchPaths = searchPaths;
  return hunspellDictionarySearchPaths;
}
function getAvailableDictionaries() {
  if (availableDictionaries) {
    return availableDictionaries;
  }
  availableDictionaries = [].concat(getHunspellDictionaries());

  // Remove duplicates
  availableDictionaries = Array.from(new Set(availableDictionaries));
  return availableDictionaries;
}
function getHunspellDictionaries() {
  try {
    const searchPaths = getDictionarySearchPaths();
    return _files.default.getAllDictionariesSync(searchPaths);
  } catch (err) {
    logError(err);
  }
  return [];
}
function getDictionaryPath(langCode) {
  let searchPaths = getDictionarySearchPaths();
  searchPaths = searchPaths.map(searchPath => {
    return [_path.default.join(searchPath, langCode.replace('-', '_') + '.dic'), _path.default.join(searchPath, langCode.replace('_', '-') + '.dic')];
  });

  // Flatten and remove duplicates
  searchPaths = [].concat.apply([], searchPaths);
  searchPaths = Array.from(new Set(searchPaths));
  return searchPaths.find(searchPath => statSyncNoException(searchPath));
}