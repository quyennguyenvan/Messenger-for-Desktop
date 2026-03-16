"use strict";

const {
  app
} = require('@electron/remote');
const path = require('path');
const initPath = path.join(app.getAppPath(), 'scripts', 'renderer', 'init.js');
require(initPath).inject('renderer');
require('renderer/webview');
require('renderer/components/keymap');