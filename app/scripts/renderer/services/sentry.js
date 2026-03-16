if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClient = getClient;
var _ravenJs = _interopRequireDefault(require("raven-js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getClient() {
  _ravenJs.default.config(global.manifest.sentry.dsn, {
    release: global.manifest.version,
    name: global.manifest.productName,
    collectWindowErrors: false,
    allowSecretKey: true
  }).install();
  return _ravenJs.default;
}