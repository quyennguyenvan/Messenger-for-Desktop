"use strict";

var _appModulePath = require("app-module-path");
var _electron = require("electron");
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const manifest = require('../../package.json');
global.manifest = manifest;
const appPath = _electron.app.getAppPath();
const scriptsPath = _path.default.join(appPath, 'scripts');
(0, _appModulePath.addPath)(scriptsPath);
require('browser/main');