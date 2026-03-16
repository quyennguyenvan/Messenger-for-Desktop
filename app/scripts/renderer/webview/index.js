if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const remote = require('@electron/remote');
const path = require('path');
const webView = document.getElementById('wv');

// Fix preload requiring file:// protocol
const appPath = remote.app.getAppPath();
let preloadPath = webView.getAttribute('preload');
preloadPath = 'file://' + path.join(appPath, 'scripts', 'renderer', 'preload', 'index.js');
webView.setAttribute('preload', preloadPath);

// Set the user agent and load the app
// Always use standard Facebook Messenger, ignore Workplace toggle.
const wvSrc = global.manifest.wvUrl;
log('loading', wvSrc);
webView.setAttribute('useragent', navigator.userAgent);
webView.setAttribute('src', wvSrc);
var _default = exports.default = webView;
require('renderer/webview/events');
require('renderer/webview/listeners');