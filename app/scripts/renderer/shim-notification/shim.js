if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

var _remote = require("@electron/remote");
var _url = _interopRequireDefault(require("url"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const params = _url.default.parse(window.location.href, true).query;
const nativeNotifier = _remote.remote.require('common/bridges/native-notifier').default;
function closeWindow() {
  window.close();
}
function onClick() {
  nativeNotifier.onClick(params.identifier);
  closeWindow();
}
function onLoad() {
  const timeout = parseInt(params.timeout, 10);
  if (!isNaN(timeout)) {
    this.setTimeout(closeWindow, timeout);
  }
  document.addEventListener('keydown', onClick, false);
  document.addEventListener('click', onClick);
}
document.getElementById('title').innerHTML = params.title;
document.getElementById('body').innerHTML = params.body;
document.getElementById('icon').style.backgroundImage = 'url(' + params.icon + ')';
document.getElementById('footer').innerHTML = params.footer;
window.addEventListener('load', onLoad, false);