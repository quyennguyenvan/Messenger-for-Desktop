if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTracker = getTracker;
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function send(name, ...args) {
  const trackAnalytics = _prefs.default.get('analytics-track');
  if (!trackAnalytics) {
    return;
  }
  if (global.ready) {
    const browserWindow = global.application.mainWindowManager.window;
    if (browserWindow) {
      browserWindow.webContents.send('track-analytics', name, args);
    }
  }
}
function bind(name) {
  return send.bind(null, name);
}
function getTracker() {
  return {
    trackEvent: bind('trackEvent')
  };
}