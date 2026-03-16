if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

var _remote = require("@electron/remote");
var _mousetrap = _interopRequireDefault(require("mousetrap"));
var _prefs = _interopRequireDefault(require("common/utils/prefs"));
var _webview = _interopRequireDefault(require("renderer/webview"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
log('binding keyboard shortcuts');
function bindSwitchConversation(keys, direction) {
  _mousetrap.default.bind(keys, function () {
    log(direction, 'conversation');
    if (direction === 'next') {
      _webview.default.send('switch-conversation-next');
    } else {
      _webview.default.send('switch-conversation-previous');
    }
    return false;
  });
}

// Previous chat
bindSwitchConversation(['ctrl+shift+tab'], 'previous');

// Next chat
bindSwitchConversation(['ctrl+tab'], 'next');

// Close with Esc
_mousetrap.default.bind('esc', function () {
  const enabled = _prefs.default.get('close-with-esc');
  log('close with esc shortcut, enabled:', enabled);
  if (enabled) {
    const mwm = _remote.remote.getGlobal('application').mainWindowManager;
    if (mwm) {
      mwm.window.close();
    }
  }
  return enabled;
});