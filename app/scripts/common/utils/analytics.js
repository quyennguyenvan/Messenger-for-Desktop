if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserId = getUserId;
var _nodeUuid = _interopRequireDefault(require("node-uuid"));
var _prefs = _interopRequireDefault(require("common/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getUserId() {
  let uid = _prefs.default.get('analytics-uid');

  // Generate a new one if it doesn't exist
  if (!uid) {
    uid = _nodeUuid.default.v4();
    _prefs.default.set('analytics-uid', uid);
  }
  return uid;
}