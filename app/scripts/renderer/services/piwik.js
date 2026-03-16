if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTracker = getTracker;
var _prefs = _interopRequireDefault(require("common/utils/prefs"));
var _analytics = require("common/utils/analytics");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const activeTheme = _prefs.default.get('theme');
const activeSpellCheckerLang = _prefs.default.get('spell-checker-language');
const activeReleaseChannel = _prefs.default.get('updates-channel');
const trackAnalytics = _prefs.default.get('analytics-track');
let piwikTracker = null;
if (global.manifest.dev) {
  log('piwik disabled (dev mode)');
} else if (!trackAnalytics) {
  log('piwik disabled (analytics disabled)');
} else {
  log('setting up piwik');

  // Configure
  window.piwikAsyncInit = function () {
    try {
      piwikTracker = window.Piwik.getTracker();
      piwikTracker.setDocumentTitle(document.title);
      piwikTracker.setTrackerUrl(global.manifest.piwik.serverUrl + '/piwik.php');
      piwikTracker.setCustomDimension(1, global.manifest.version); // Version
      piwikTracker.setCustomDimension(2, activeReleaseChannel); // Release Channel
      piwikTracker.setCustomDimension(3, global.manifest.distrib); // Distrib
      piwikTracker.setCustomDimension(4, activeTheme); // Theme
      piwikTracker.setCustomDimension(5, activeSpellCheckerLang); // Spell Checker Language
      piwikTracker.setUserId((0, _analytics.getUserId)());
      piwikTracker.setSiteId(global.manifest.piwik.siteId);
      piwikTracker.trackPageView();
      log('piwik analytics instance created');
    } catch (err) {
      logFatal(err);
    }
  };

  // Load the tracking lib
  const scriptElem = document.createElement('script');
  scriptElem.type = 'text/javascript';
  scriptElem.async = true;
  scriptElem.defer = true;
  scriptElem.src = global.manifest.piwik.serverUrl + '/piwik.js';
  document.head.appendChild(scriptElem);
}
function getTracker() {
  return piwikTracker;
}