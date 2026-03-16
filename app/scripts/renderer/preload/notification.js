if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

var _events = _interopRequireDefault(require("events"));
var _remote = require("@electron/remote");
var _platform = _interopRequireDefault(require("common/utils/platform"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const nativeNotifier = _remote.remote.require('common/bridges/native-notifier').default;
const mainWindowManager = _remote.remote.getGlobal('application').mainWindowManager;

// Extend the default notification API
window.Notification = function (Html5Notification) {
  log('extending HTML5 Notification');
  const Notification = function (title, options) {
    if (!nativeNotifier.isImplemented || !_platform.default.isDarwin && !_platform.default.isWindows7) {
      log('showing html5 notification', title, options);
      const notification = new Html5Notification(title, options);

      // Add click listener to focus the app
      notification.addEventListener('click', function () {
        mainWindowManager.showOrCreate();
      });
      return notification;
    }
    log('showing native notification');
    const nativeOptions = Object.assign({}, options, {
      canReply: options.canReply !== false,
      title
    });

    // HTML5-like event emitter to be returned
    const result = Object.assign(new _events.default(), nativeOptions);

    // Add a close handler
    result.close = function () {
      if (result.__data) {
        nativeNotifier.removeNotification(result.__data.identifier);
      } else {
        logFatal(new Error('tried to close notification with falsy __data'));
      }
    };

    // Set the click handler
    nativeOptions.onClick = function (payload) {
      log('notification clicked', JSON.stringify(payload));
      result.emit('click');

      // Call additional handlers
      if (result.onclick) {
        result.onclick();
      }

      // Send the reply
      if (payload && payload.response) {
        log('sending reply', payload.response);
        setTimeout(function () {
          if (typeReply(payload.response)) {
            sendReply();
          }
        }, 50);
      } else {
        mainWindowManager.showOrCreate();
      }
    };

    // Set the creation callback
    nativeOptions.onCreate = function (data) {
      result.__data = data;
    };

    // Fire the notification
    nativeNotifier.fireNotification(nativeOptions);
    return result;
  };
  return Object.assign(Notification, Html5Notification);
}(window.Notification);
function typeReply(replyText, elem) {
  const event = document.createEvent('TextEvent');
  event.initTextEvent('textInput', true, true, window, replyText, 0, 'en-US');
  const inputField = document.querySelector('[contenteditable="true"]');
  if (inputField) {
    inputField.focus();
    return inputField.dispatchEvent(event);
  }
  return false;
}
function sendReply() {
  const event = new window.MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  const sendButton = document.querySelector('[role="region"] a[aria-label][href="#"]');
  if (sendButton) {
    sendButton.dispatchEvent(event);
  }
}