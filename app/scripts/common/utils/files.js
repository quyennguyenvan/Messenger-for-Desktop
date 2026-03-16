if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fsExtraPromise = _interopRequireDefault(require("fs-extra-promise"));
var _path = _interopRequireDefault(require("path"));
var _filePaths = _interopRequireDefault(require("common/utils/file-paths"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function statSyncNoException(p) {
  try {
    return _fsExtraPromise.default.statSync(p);
  } catch (e) {
    return null;
  }
}

/**
 * @return the css of the theme
 */
async function getThemeCss(theme) {
  return await _fsExtraPromise.default.readFileAsync(_filePaths.default.getThemePath(theme), 'utf-8');
}

/**
 * @return the css of the file
 */
async function getStyleCss(style) {
  return await _fsExtraPromise.default.readFileAsync(_filePaths.default.getStylePath(style), 'utf-8');
}

/**
 * @return the list of Hunspell dictionaries available in the given dir
 */
function getDictionariesSync(dirPath) {
  if (!statSyncNoException(dirPath)) {
    log('dictionaries path does not exist', dirPath);
    return [];
  }
  const dictionaries = _fsExtraPromise.default.readdirSync(dirPath).filter(filename => _path.default.extname(filename) === '.dic').filter(filename => _fsExtraPromise.default.statSync(_path.default.join(dirPath, filename)).isFile()).map(filename => _path.default.basename(filename, '.dic'));
  log('dictionaries in', dirPath, 'found:', JSON.stringify(dictionaries));
  return dictionaries;
}

/**
 * @return the list of Hunspell dictionaries available in all the given dirs
 */
function getAllDictionariesSync(dirPaths) {
  return dirPaths.reduce((acc, dirPath) => {
    return acc.concat(getDictionariesSync(dirPath));
  }, []);
}

/**
 * Verify it's not a directory and the app can access it.
 * If it's invalid, purge it and write it again.
 * If it already exists, it's left untouched.
 */
async function replaceFile(filePath, writePromise) {
  try {
    await _fsExtraPromise.default.accessAsync(filePath, _fsExtraPromise.default.R_OK | _fsExtraPromise.default.W_OK);
    const stats = await _fsExtraPromise.default.lstatAsync(filePath);
    if (!stats.isFile()) {
      throw new Error();
    }
  } catch (err) {
    // err ignored
    // no access / does not exist
    try {
      await _fsExtraPromise.default.removeAsync(filePath);
    } catch (err2) {
      // err2 ignored
    }
    await writePromise();
  }
}

/**
 * Check if the path exists, can be accessed and is a file.
 */
async function isFileExists(filePath) {
  try {
    await _fsExtraPromise.default.accessAsync(filePath, _fsExtraPromise.default.R_OK | _fsExtraPromise.default.W_OK);
    const stats = await _fsExtraPromise.default.lstatAsync(filePath);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}
var _default = exports.default = {
  getThemeCss,
  getStyleCss,
  getDictionariesSync,
  getAllDictionariesSync,
  replaceFile,
  isFileExists
};