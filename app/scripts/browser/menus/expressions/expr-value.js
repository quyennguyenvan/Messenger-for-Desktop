if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eq = eq;
exports.key = key;
exports.not = not;
exports.pref = pref;
exports.styleCss = styleCss;
exports.sum = sum;
exports.themeCss = themeCss;
exports.val = val;
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
var _files = _interopRequireDefault(require("common/utils/files"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Wrapper for a raw value.
 */
function val(value) {
  return function () {
    return value;
  };
}

/**
 * Returns the given key's value from the item.
 */
function key(localKey) {
  return function (item) {
    return item[localKey];
  };
}

/**
 * Returns the pref value for the given key.
 */
function pref(prefName) {
  return function () {
    return _prefs.default.get(prefName);
  };
}

/**
 * Negates the given value.
 */
function not(valueExpr) {
  return function () {
    return !valueExpr.apply(this, arguments);
  };
}

/**
 * Sums up two expressions.
 */
function sum(value1Expr, value2Expr) {
  return function () {
    return value1Expr.apply(this, arguments) + value2Expr.apply(this, arguments);
  };
}

/**
 * Checks 2 expressions for equality.
 */
function eq(value1Expr, value2Expr) {
  return function () {
    return value1Expr.apply(this, arguments) === value2Expr.apply(this, arguments);
  };
}

/**
 * Gets the css content of the given theme.
 */
function themeCss(nameExpr, callback) {
  return function () {
    const theme = nameExpr.apply(this, arguments);
    _files.default.getThemeCss(theme).then(css => callback(css).apply(this, arguments)).catch(logError);
  };
}

/**
 * Gets the css content of the given style.
 */
function styleCss(styleName, callback) {
  return function () {
    _files.default.getStyleCss(styleName).then(css => callback(css).apply(this, arguments)).catch(logError);
  };
}