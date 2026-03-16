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
    impl = require('electron').app;
    break;
  case 'renderer':
    impl = require('@electron/remote').app;
    break;
}
var _default = exports.default = impl;