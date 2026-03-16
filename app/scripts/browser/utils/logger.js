"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printDebug = printDebug;
exports.printError = printError;
var _safe = _interopRequireDefault(require("colors/safe"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getCleanISODate() {
  return new Date().toISOString().replace(/[TZ]/g, ' ').trim();
}
function printDebug() {
  if (global.options.consoleLogs) {
    console.log(...arguments);
  }
  const fileLogger = require('browser/utils/file-logger');
  fileLogger.writeLog(`DEBUG [${getCleanISODate()}]`, ...arguments);
}
function printError(namespace, isFatal, err) {
  const errorPrefix = `${isFatal ? 'FATAL' : 'ERROR'} [${getCleanISODate()}]   ${namespace}:`;
  if (global.options.consoleLogs) {
    if (isFatal) {
      console.error(_safe.default.white.bold.bgMagenta(errorPrefix), err);
    } else {
      console.error(_safe.default.white.bold.bgRed(errorPrefix), err);
    }
  }
  const fileLogger = require('browser/utils/file-logger');
  fileLogger.writeLog(errorPrefix, err);
}