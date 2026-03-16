if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClient = getClient;
var _raven = _interopRequireDefault(require("raven"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getClient() {
  return new _raven.default.Client(global.manifest.sentry.dsn, {
    release: global.manifest.version,
    name: global.manifest.productName
  });
}