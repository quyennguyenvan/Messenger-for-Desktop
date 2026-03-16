if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _url = _interopRequireDefault(require("url"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Skip opening the link through Facebook.
 * It converts [facebook|messenger].com/l.php?u=<encodedUrl> to <unencodedUrl>.
 */
function skipFacebookRedirect(urlLink) {
  const parsed = _url.default.parse(urlLink, true);
  log('skip facebook redirect, checking', urlLink);
  if (!parsed || !parsed.hostname || !parsed.pathname) {
    return urlLink;
  }
  const hostMatches = parsed.hostname.includes('facebook.com') || parsed.hostname.includes('messenger.com');
  const pathMatches = parsed.pathname.includes('/l.php');
  if (hostMatches && pathMatches && parsed.query.u) {
    urlLink = parsed.query.u;
  }
  return urlLink;
}

/**
 * Check if the given url is a downloadable file. Currently only detects Facebook CDN urls.
 */
function isDownloadUrl(urlLink) {
  const isDlUrl = urlLink.startsWith('https://cdn.fbsbx.com') && urlLink.endsWith('&dl=1');
  log('link is download url', urlLink, isDlUrl);
  return isDlUrl;
}
var _default = exports.default = {
  skipFacebookRedirect,
  isDownloadUrl
};