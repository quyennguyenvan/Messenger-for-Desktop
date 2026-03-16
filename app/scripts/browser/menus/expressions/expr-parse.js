if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLocal = setLocal;
exports.setPref = setPref;
exports.unsetPref = unsetPref;
exports.updateMenuItem = updateMenuItem;
exports.updateSibling = updateSibling;
var _electron = require("electron");
var _utils = require("browser/menus/utils");
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Set a key of the item with the given value.
 */
function setLocal(localKey, valueExpr) {
  return function (item) {
    item[localKey] = valueExpr.apply(this, arguments);
  };
}

/**
 * Sets a preference key.
 */
function setPref(prefName, valueExpr) {
  return function () {
    _prefs.default.set(prefName, valueExpr.apply(this, arguments));
  };
}

/**
 * Unsets a preference key.
 */
function unsetPref(prefName) {
  return function () {
    _prefs.default.unset(prefName);
  };
}

/**
 * Updates the value of a sibling item's key.
 */
function updateSibling(siblingId, siblingKey, valueExpr) {
  return function (item) {
    const submenu = this && this.submenu || item && item.menu && item.menu.items;
    if (submenu) {
      const sibling = submenu.find(i => i.id === siblingId);
      if (sibling) {
        sibling[siblingKey] = valueExpr.apply(this, arguments);
      }
    }
  };
}

/**
 * Update an item from another menu.
 */
function updateMenuItem(menuType, itemId) {
  return function (...valueExprs) {
    return function (exprCallback) {
      return function () {
        const menu = (0, _utils.findMenu)(menuType);
        if (!menu) {
          return log('menu not found', menuType);
        }
        const menuItem = (0, _utils.findItemById)(menu.items, itemId);
        if (!menuItem) {
          return log('menu item not found', itemId);
        }
        const values = valueExprs.map(e => e.apply(this, arguments));
        const expr = exprCallback(...values);
        const browserWindow = _electron.BrowserWindow.getFocusedWindow();
        expr.call(global, menuItem, browserWindow);
      };
    };
  };
}