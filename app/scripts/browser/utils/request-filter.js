if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disable = disable;
exports.enable = enable;
exports.set = set;
/**
 * URL match patterns to be filteresd.
 * @see https://developer.chrome.com/extensions/match_patterns
 */
const URL_PATTERNS = ['*://*.facebook.com/*change_read_status*', '*://*.messenger.com/*change_read_status*', '*://*.facebook.com/*typ.php*', '*://*.messenger.com/*typ.php*'];

/**
 * Enable request cancelling of urls matched by pattern list.
 */
function enable(targetSession) {
  targetSession.webRequest.onBeforeRequest({
    urls: URL_PATTERNS
  }, (details, callback) => {
    log('request filter', 'blocked', details.url);
    callback({
      cancel: true
    });
  });
  log('request filter', 'enabled', URL_PATTERNS.length, 'entries');
}

/**
 * Disable request cancelling of urls matched by pattern list.
 */
function disable(targetSession) {
  targetSession.webRequest.onBeforeRequest({
    urls: URL_PATTERNS
  }, null);
  log('request filter', 'disabled');
}

/**
 * Setter convenience interface.
 */
function set(shouldEnable, targetSession) {
  if (shouldEnable) {
    enable(targetSession);
  } else {
    disable(targetSession);
  }
}