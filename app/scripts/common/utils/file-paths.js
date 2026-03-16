if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _app = _interopRequireDefault(require("common/electron/app"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @return the theme's css path
 */
function getThemePath(name) {
  return _path.default.join(_app.default.getAppPath(), 'themes', name + '.css');
}

/**
 * @return the style's css path
 */
function getStylePath(name) {
  return _path.default.join(_app.default.getAppPath(), 'styles', name + '.css');
}

/**
 * @return the image's path
 */
function getImagePath(name) {
  return _path.default.join(_app.default.getAppPath(), 'images', name);
}

/**
 * Windows only.
 * @return the directory where the app is ran from
 */
function getCustomUserDataPath() {
  return _path.default.join(_path.default.dirname(_app.default.getPath('exe')), 'data');
}

/**
 * Windows only.
 * @return the path to Update.exe created by Squirrel.Windows
 */
function getSquirrelUpdateExePath() {
  return _path.default.join(_path.default.dirname(_app.default.getPath('exe')), '..', 'Update.exe');
}
var _default = exports.default = {
  getThemePath,
  getStylePath,
  getImagePath,
  getCustomUserDataPath,
  getSquirrelUpdateExePath
};