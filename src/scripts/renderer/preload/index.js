const {app} = require('@electron/remote');
const path = require('path');
const initPath = path.join(app.getAppPath(), 'scripts', 'renderer', 'init.js');
require(initPath).inject('webview');

require('renderer/preload/events');
require('renderer/preload/notification');
