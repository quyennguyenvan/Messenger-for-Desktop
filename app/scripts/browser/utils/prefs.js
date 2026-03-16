if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fsExtraPromise = _interopRequireDefault(require("fs-extra-promise"));
var _electron = require("electron");
var _path = _interopRequireDefault(require("path"));
var _prefsDefaults = _interopRequireDefault(require("browser/utils/prefs-defaults"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
let prefsPath = null;
let data = null;
function ensureDataLoaded() {
  if (!prefsPath) {
    prefsPath = _path.default.join(_electron.app.getPath('userData'), 'prefs.json');
  }
  if (!data) {
    try {
      data = _fsExtraPromise.default.readJsonSync(prefsPath) || {};
      log('prefs data restored');
    } catch (err) {
      logError(err, true);
      data = {};
    }
  }
}

/**
 * Save the given (key, value) pair asynchronously.
 * Returns immediately and logs errors.
 */
function set(key, value) {
  ensureDataLoaded();
  data[key] = value;
  _fsExtraPromise.default.outputJson(prefsPath, data, function (err) {
    if (err) {
      logError(err, true);
    } else {
      log('saved', key, '=', JSON.stringify(value));
    }
  });
}

/**
 * Save the given (key, value) pair synchronously.
 * Returns immediately and logs errors.
 */
function setSync(key, value) {
  ensureDataLoaded();
  data[key] = value;
  try {
    _fsExtraPromise.default.outputJsonSync(prefsPath, data);
    log('saved', key, '=', JSON.stringify(value));
  } catch (err) {
    logError(err, true);
  }
}

/**
 * Retrieve the value synchronously.
 */
function get(key) {
  ensureDataLoaded();
  const value = data[key];
  if (value === undefined) {
    const defaultValue = getDefault(key);
    if (defaultValue === undefined) {
      logFatal(new Error('default value for key ' + key + ' is undefined'));
    }
    return defaultValue;
  }
  return value;
}

/**
 * Retrieve all the prefs.
 */
function getAll() {
  ensureDataLoaded();
  return data;
}

/**
 * Retrieve the default value.
 */
function getDefault(key) {
  return _prefsDefaults.default.get(key);
}

/**
 * Remove the given key asynchronously.
 */
function unset(key) {
  ensureDataLoaded();
  delete data[key];
  _fsExtraPromise.default.outputJson(prefsPath, data, function (err) {
    if (err) {
      logError(err, true);
    } else {
      log('unset', key);
    }
  });
}

/**
 * Remove the given key synchronously.
 */
function unsetSync(key) {
  ensureDataLoaded();
  delete data[key];
  try {
    _fsExtraPromise.default.outputJsonSync(prefsPath, data);
    log('unset', key);
  } catch (err) {
    logError(err, true);
  }
}

/**
 * Remove all the keys and their values.
 */
function clear() {
  ensureDataLoaded();
  data = {};
  _fsExtraPromise.default.outputJson(prefsPath, data, function (err) {
    if (err) {
      logError(err, true);
    } else {
      log('all keys cleared');
    }
  });
}
var _default = exports.default = {
  set,
  setSync,
  get,
  getAll,
  getDefault,
  unset,
  unsetSync,
  clear
};