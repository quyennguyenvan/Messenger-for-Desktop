if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let impl = null;
switch (process.type) {
  case 'browser':
    impl = require('debug/node');
    break;
  case 'renderer':
    impl = require('debug/node');
    // Fix for colors and formatting
    const remoteDebug = require('@electron/remote').require('debug');
    impl.useColors = function () {
      return remoteDebug.useColors(...arguments);
    };
    break;
}

// Force-enable debug
if (global.options.debug) {
  impl.enable(process.env.DEBUG || global.manifest.name + ':*');
}
var _default = exports.default = impl;