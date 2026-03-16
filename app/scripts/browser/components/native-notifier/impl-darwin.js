if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _electron = require("electron");
var _base = _interopRequireDefault(require("browser/components/native-notifier/base"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DarwinNativeNotifier extends _base.default {
  constructor() {
    super();

    // Flag that this notifier has been implemented
    this.isImplemented = true;
  }
  fireNotification({
    title,
    subtitle,
    body,
    tag = title,
    canReply,
    icon,
    onClick,
    onCreate
  }) {
    const identifier = (tag || title || '') + ':::' + Date.now();
    const notif = new _electron.Notification({
      title: title || global.manifest.productName,
      subtitle: subtitle || undefined,
      body: body || '',
      silent: false
    });
    const payload = {
      tag,
      identifier
    };
    notif.on('click', () => {
      this.emit('notif-activated-' + identifier, payload);
      this.emit('notif-activated', payload);
      if (typeof onClick === 'function') {
        onClick(payload);
      }
    });
    log('delivering notification', JSON.stringify(payload));
    notif.show();
    if (typeof onCreate === 'function') {
      onCreate(payload);
    }
  }
}
var _default = exports.default = DarwinNativeNotifier;