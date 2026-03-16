if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _electron = require("electron");
var _remote = require("@electron/remote");
var _webview = _interopRequireDefault(require("renderer/webview"));
var _platform = _interopRequireDefault(require("common/utils/platform"));
var _graphics = _interopRequireDefault(require("common/utils/graphics"));
var _files = _interopRequireDefault(require("common/utils/files"));
var _prefs = _interopRequireDefault(require("common/utils/prefs"));
var _urls = _interopRequireDefault(require("common/utils/urls"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Log console messages
_webview.default.addEventListener('console-message', function (event) {
  const msg = event.message.replace(/%c/g, '');
  console.log('WV: ' + msg);
  log('WV:', msg);
});

// Listen for title changes to update the badge
let _delayedRemoveBadge = null;
_webview.default.addEventListener('page-title-updated', function () {
  log('webview page-title-updated');
  const matches = /\(([\d]+)\)/.exec(_webview.default.getTitle());
  const parsed = parseInt(matches && matches[1], 10);
  const count = isNaN(parsed) || !parsed ? '' : '' + parsed;
  let badgeDataUrl = null;
  if (_platform.default.isWindows && count) {
    badgeDataUrl = _graphics.default.createBadgeDataUrl(count);
  }
  log('notifying window of notif-count', count, !!badgeDataUrl || null);
  clearTimeout(_delayedRemoveBadge);

  // clear badge either instantly or after delay
  _delayedRemoveBadge = setTimeout(() => {
    const mwm = _remote.remote.getGlobal('application').mainWindowManager;
    if (mwm && typeof mwm.notifCountChanged === 'function') {
      mwm.notifCountChanged(count, badgeDataUrl);
    }
  }, count ? 0 : 1500);
});

// Handle url clicks
_webview.default.addEventListener('new-window', function (event) {
  log('webview new-window', JSON.stringify(event));
  const url = _urls.default.skipFacebookRedirect(event.url);
  event.preventDefault();

  // download url
  if (_urls.default.isDownloadUrl(url)) {
    log('on webview new-window, downloading', url);
    _webview.default.getWebContents().loadURL(url);
    return;
  }

  // open it externally (if preference is set)
  if (_prefs.default.get('links-in-browser')) {
    log('on webview new-window, externally', url);
    _electron.shell.openExternal(url);
    return;
  }

  // otherwise open it in a new app window (unless it's an audio/video call)
  if (event.frameName !== 'Video Call' || event.url !== 'about:blank') {
    const options = {
      title: event.frameName || global.manifest.productName,
      darkTheme: global.manifest.darkThemes.includes(_prefs.default.get('theme'))
    };
    log('on webview new-window, new window', url, options);
    const newWindow = new _remote.remote.BrowserWindow(options);
    newWindow.loadURL(url);
    event.newGuest = newWindow;
  }
});

// Listen for dom-ready
_webview.default.addEventListener('dom-ready', function () {
  log('webview dom-ready');

  // Open dev tools when debugging
  const autoLaunchDevTools = window.localStorage.autoLaunchDevTools;
  if (autoLaunchDevTools && JSON.parse(autoLaunchDevTools)) {
    _webview.default.openDevTools();
  }

  // Restore the default theme
  const themeId = _prefs.default.get('theme');
  if (themeId) {
    if (global.manifest.themes[themeId]) {
      log('restoring theme', themeId);
      _files.default.getThemeCss(themeId).then(css => _webview.default.send('apply-theme', css)).catch(logError);
    } else {
      log('invalid theme, unsetting pref');
      _prefs.default.unset('theme');
    }
  }

  // Load webview style overrides
  log('restoring webview css override', themeId);
  _files.default.getStyleCss('webview').then(css => _webview.default.send('apply-webview-css', css)).catch(logError);

  // TODO: Restore the sidebar auto-hide setting
  // const sidebarAutoHide = prefs.get('sidebar-auto-hide');
  // if (sidebarAutoHide) {
  //   log('restoring sidebar auto-hide', sidebarAutoHide);
  //   files.getStyleCss('auto-hide-sidebar')
  //     .then((css) => webView.send('apply-sidebar-auto-hide', sidebarAutoHide, css))
  //     .catch(logError);
  // }

  // Restore the zoom level
  const zoomLevel = _prefs.default.get('zoom-level');
  if (zoomLevel) {
    log('restoring zoom level', zoomLevel);
    _webview.default.setZoomLevel(zoomLevel);
  }

  // Restore spell checker and auto correct
  const spellCheckerCheck = _prefs.default.get('spell-checker-check');
  if (spellCheckerCheck) {
    const autoCorrect = _prefs.default.get('spell-checker-auto-correct');
    const langCode = _prefs.default.get('spell-checker-language');
    log('restoring spell checker', spellCheckerCheck, 'auto correct', autoCorrect, 'lang code', langCode);
    _webview.default.send('spell-checker', spellCheckerCheck, autoCorrect, langCode);
  }

  // Show an 'app updated' notification
  if (_prefs.default.get('notify-app-updated')) {
    _webview.default.send('notify-app-updated');
    _prefs.default.set('notify-app-updated', false);
  }
});

// Listen for did-finish-load
_webview.default.addEventListener('did-finish-load', function () {
  log('webview did-finish-load');

  // Hide the loading splash screen
  const loadingSplashDiv = document.querySelector('.loader');
  loadingSplashDiv.style.opacity = 0;
  setTimeout(function () {
    loadingSplashDiv.style.display = 'none';
  }, 250);
});

// Forward context menu opens
_webview.default.addEventListener('context-menu', function (event) {
  const paramDefaults = {
    isWindows7: _platform.default.isWindows7
  };
  const params = JSON.stringify(Object.assign(paramDefaults, event.params));
  log('sending context menu', params);
  const mwm = _remote.remote.getGlobal('application').mainWindowManager;
  if (mwm) {
    mwm.openContextMenu(params);
  }
  event.preventDefault();
});

// Animate the splash screen into view
document.addEventListener('DOMContentLoaded', function () {
  log('document DOMContentLoaded');

  // Show the loading splash screen
  const loadingSplashDiv = document.querySelector('.loader');
  loadingSplashDiv.style.opacity = 1;

  // In case did-finish-load isn't called, set a timeout
  setTimeout(function () {
    loadingSplashDiv.style.opacity = 0;
    setTimeout(function () {
      loadingSplashDiv.style.display = 'none';
    }, 250);
  }, 10 * 1000);
});
var _default = exports.default = _webview.default;