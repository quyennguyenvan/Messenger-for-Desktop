if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findItemById = findItemById;
exports.findMenu = findMenu;
exports.parseTemplate = parseTemplate;
var _electron = require("electron");
function parseTemplate(menu, parent) {
  return menu.filter(item => {
    // Filter
    if (item.allow !== undefined && !item.allow) {
      return false;
    }

    // Run the parse-time expression
    if (item.parse) {
      item.parse.call(parent, item);
    }

    // Clean up
    delete item.parse;
    delete item.allow;

    // Parse submenu items
    if (Array.isArray(item.submenu)) {
      item.submenu = parseTemplate(item.submenu, item);
    }
    return true;
  });
}
function findItemById(submenu, id) {
  for (let item of submenu) {
    if (item.id === id) {
      return item;
    }
    if (item.submenu) {
      const subItem = findItemById(item.submenu.items, id);
      if (subItem) {
        return subItem;
      }
    }
  }
  return null;
}
function findMenu(menuType) {
  switch (menuType) {
    case 'main':
      return _electron.Menu.getApplicationMenu();
    case 'tray':
      return global.application.trayManager.menu;
  }
}