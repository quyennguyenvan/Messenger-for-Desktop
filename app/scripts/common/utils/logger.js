"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugLogger = debugLogger;
exports.errorLogger = errorLogger;
var _util = _interopRequireDefault(require("util"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function namespaceOfFile(filename) {
  const app = require('common/electron/app').default;
  const appPath = _path.default.join(app.getAppPath(), 'scripts') + _path.default.sep;
  let name = filename.replace(appPath, '').replace(/\\/g, '/').replace('.js', '');
  if (name.startsWith('common/')) {
    name += ':' + process.type;
  }

  // replace slashes with semicolons
  name = name.replace(/\//g, ':');
  return global.manifest.name + ':' + name;
}
function reportToSentry(namespace, isFatal, err) {
  const sentry = require('common/services/sentry').default;
  if (sentry) {
    console.log('reporting to sentry:', err);
    sentry.captureException(err, {
      level: isFatal ? 'fatal' : 'error',
      extra: {
        trace: new Error().stack
      },
      tags: {
        namespace
      }
    }, function (result) {
      console.log('reported to sentry:', result);
    });
  }
}
function debugLogger(filename) {
  let logger = null;
  let browserLogger = null;
  return function () {
    if (!logger) {
      const debug = require('common/modules/debug').default;
      logger = debug(namespaceOfFile(filename));
    }
    if (!browserLogger) {
      browserLogger = require('common/utils/logger-browser').default;
    }
    logger.log = browserLogger.printDebug;
    logger(_util.default.format(...arguments));
  };
}
function errorLogger(filename, isFatal) {
  let namespace = null;
  let browserLogger = null;
  return function (err, skipReporting = false) {
    if (!namespace) {
      namespace = namespaceOfFile(filename);
    }
    if (!(err instanceof Error)) {
      if (global.options.dev) {
        const fnName = isFatal ? 'logFatal' : 'logError';
        throw new Error('the first parameter to ' + fnName + ' must be an Error');
      } else {
        err = new Error(err);
      }
    }
    if (!browserLogger) {
      browserLogger = require('common/utils/logger-browser').default;
    }
    browserLogger.printError(namespace, isFatal, err.stack);
    if (!skipReporting && !global.options.debug) {
      reportToSentry(namespace, isFatal, err);
    }
  };
}