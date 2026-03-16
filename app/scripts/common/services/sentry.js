if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _os = _interopRequireDefault(require("os"));
var _prefs = _interopRequireDefault(require("common/utils/prefs"));
var _analytics = require("common/utils/analytics");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const trackAnalytics = _prefs.default.get('analytics-track');
let client = null;
if (global.manifest.dev) {
  log('sentry disabled (dev mode)');
} else if (!trackAnalytics) {
  log('sentry disabled (analytics disabled)');
} else {
  log('setting up sentry');
  client = require(process.type + '/services/sentry').getClient();
  client.setUserContext({
    uid: (0, _analytics.getUserId)()
  });
  client.setExtraContext({
    portable: global.manifest.portable,
    buildNum: global.manifest.buildNum,
    os_release: _os.default.release(),
    versions: {
      electron: global.manifest.electronVersion,
      app: global.manifest.version
    },
    prefs: _prefs.default.getAll()
  });
  client.setTagsContext({
    process_type: 'renderer',
    distrib: global.manifest.distrib,
    os_platform: _os.default.platform()
  });
}
var _default = exports.default = client;