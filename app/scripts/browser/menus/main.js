if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _utils = require("browser/menus/utils");
function _default() {
  const template = ['browser/menus/templates/main-app', 'browser/menus/templates/main-edit', 'browser/menus/templates/main-view', 'browser/menus/templates/main-theme', 'browser/menus/templates/main-privacy', 'browser/menus/templates/main-window', 'browser/menus/templates/main-help'].map(module => require(module).default);
  return (0, _utils.parseTemplate)(template, null);
}