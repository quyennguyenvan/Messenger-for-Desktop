if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

var _electron = require("electron");
var piwik = _interopRequireWildcard(require("renderer/services/piwik"));
var _webview = _interopRequireDefault(require("renderer/webview"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Change the webview's zoom level.
 */
_electron.ipcRenderer.on('zoom-level', function (event, zoomLevel) {
  log('setting webview zoom level', zoomLevel);
  _webview.default.setZoomLevel(zoomLevel);
});

/**
 * Forward a message to the webview.
 */
_electron.ipcRenderer.on('fwd-webview', function (event, channel, ...args) {
  if (typeof _webview.default.isLoading === 'function' && !_webview.default.isLoading()) {
    _webview.default.send(channel, ...args);
  } else {
    const onLoaded = function () {
      _webview.default.send(channel, ...args);
      _webview.default.removeEventListener('dom-ready', onLoaded);
    };
    _webview.default.addEventListener('dom-ready', onLoaded);
  }
});

/**
 * Call a method of the webview.
 */
_electron.ipcRenderer.on('call-webview-method', function (event, method, ...args) {
  if (typeof _webview.default[method] === 'function') {
    _webview.default[method](...args);
  } else {
    logError(new Error('method ' + method + ' on webview is not a function'));
  }
});

/**
 * Toggle the dev tools panel of the webview.
 */
_electron.ipcRenderer.on('toggle-wv-dev-tools', function (event) {
  if (_webview.default.isDevToolsOpened()) {
    _webview.default.closeDevTools();
  } else {
    _webview.default.openDevTools();
  }
});

/**
 * Track an analytics event.
 */
_electron.ipcRenderer.on('track-analytics', function (event, name, args) {
  const tracker = piwik.getTracker();
  if (typeof tracker !== 'function') {
    const trackerFn = tracker[name];
    trackerFn(...args);
  } else {
    logError(new Error('piwik.getTracker is not a function'));
  }
});