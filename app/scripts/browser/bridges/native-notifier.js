if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function createAppliedHandler(name) {
  return function () {
    const nativeNotifier = global.application.nativeNotifier;
    const func = nativeNotifier[name];
    if (func) {
      func.apply(nativeNotifier, arguments);
    }
  };
}

/**
 * Used from the renderer to fire native notifications.
 * Accessing global.application.nativeNotifier directly doesn't work.
 */
var _default = exports.default = {
  isImplemented: !!global.application.nativeNotifier.isImplemented,
  fireNotification: createAppliedHandler('fireNotification'),
  removeNotification: createAppliedHandler('removeNotification'),
  onClick: createAppliedHandler('onClick')
};