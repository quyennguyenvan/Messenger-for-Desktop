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

export default webView;

require('renderer/webview/events');
require('renderer/webview/listeners');
