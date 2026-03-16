const {app} = require('@electron/remote');
const path = require('path');
const initPath = path.join(app.getAppPath(), 'scripts', 'renderer', 'init.js');
require(initPath).inject('shim-notification');

require('renderer/shim-notification/shim');
