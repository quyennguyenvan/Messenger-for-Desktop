if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = _interopRequireDefault(require("events"));
var _electron = require("electron");
var _autoUpdater = _interopRequireDefault(require("browser/components/auto-updater"));
var _utils = require("browser/menus/utils");
var _main = _interopRequireDefault(require("browser/menus/main"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class MainMenuManager extends _events.default {
  constructor() {
    super();
    this.cfuVisibleItem = null;
  }
  create() {
    if (!this.menu) {
      this.menu = _electron.Menu.buildFromTemplate((0, _main.default)());
      log('app menu created');
    } else {
      log('app menu already created');
    }
  }
  setDefault() {
    if (this.menu) {
      _electron.Menu.setApplicationMenu(this.menu);
      log('app menu set');
    } else {
      logError(new Error('menu not created'));
    }
  }
  setAutoUpdaterListeners() {
    if (!this.cfuVisibleItem) {
      this.cfuVisibleItem = (0, _utils.findItemById)(this.menu.items, 'cfu-check-for-update');
    }
    const eventToIdMap = {
      'error': 'cfu-check-for-update',
      'checking-for-update': 'cfu-checking-for-update',
      'update-available': 'cfu-update-available',
      'update-not-available': 'cfu-check-for-update',
      'update-downloaded': 'cfu-update-downloaded'
    };
    for (let [eventName, itemId] of Object.entries(eventToIdMap)) {
      _autoUpdater.default.on(eventName, () => {
        log('auto updater on:', eventName, 'params:', ...arguments);
        this.cfuVisibleItem.visible = false;
        this.cfuVisibleItem = (0, _utils.findItemById)(this.menu.items, itemId);
        this.cfuVisibleItem.visible = true;
      });
    }
  }
  windowSpecificItemsEnabled(enabled, items = this.menu.items) {
    for (let item of items) {
      if (item.needsWindow) {
        item.enabled = enabled;
      } else if (item.submenu) {
        this.windowSpecificItemsEnabled(enabled, item.submenu.items);
      }
    }
  }
}
var _default = exports.default = MainMenuManager;