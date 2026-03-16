if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;
exports.custom = custom;
exports.ifTrue = ifTrue;
/**
 * Run all the given expressions, serially.
 */
function all(...exprs) {
  return function () {
    for (let expr of exprs) {
      expr.apply(this, arguments);
    }
  };
}

/**
 * The equivalent of an 'if' statement.
 */
function ifTrue(condExpr, trueExpr, falseExpr) {
  return function () {
    const cond = condExpr.apply(this, arguments);
    if (cond) {
      if (trueExpr) {
        trueExpr.apply(this, arguments);
      }
    } else if (falseExpr) {
      falseExpr.apply(this, arguments);
    }
  };
}

/**
 * Runs a custom function.
 */
function custom(fn) {
  return function () {
    fn.apply(this, arguments);
  };
}