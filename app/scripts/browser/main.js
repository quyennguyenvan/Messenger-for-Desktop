if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

var _electron = require("electron");
var remoteMain = _interopRequireWildcard(require("@electron/remote/main"));
var _yargs = _interopRequireDefault(require("yargs"));
var _prefs = _interopRequireDefault(require("browser/utils/prefs"));
var _filePaths = _interopRequireDefault(require("common/utils/file-paths"));
var _platform = _interopRequireDefault(require("common/utils/platform"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Handle uncaught exceptions
process.on('uncaughtException', function (err) {
  _electron.dialog.showErrorBox('JavaScript error in the main process', err.stack);
  logFatal(err);
});

// Handle promise rejections
process.on('unhandledRejection', function (err) {
  log('unhandled promise rejection');
  logFatal(err);
});

// Enable @electron/remote (replacement for removed electron.remote)
remoteMain.initialize();
_electron.app.on('web-contents-created', (event, contents) => {
  try {
    remoteMain.enable(contents);
  } catch (err) {
    // If enabling remote fails for a given WebContents, keep running.
    logError(err);
  }
});

// Define the CLI arguments and parse them
const cliArgs = process.argv.slice(1);
const options = (0, _yargs.default)(cliArgs).usage('Usage: $0 [options]').option('os-startup', {
  type: 'boolean',
  description: 'Flag to indicate the app is being run by the OS on startup.'
}).option('portable', {
  type: 'boolean',
  description: 'Run in portable mode.'
}).option('debug', {
  type: 'boolean',
  description: 'Run in debug mode.'
}).option('console-logs', {
  type: 'boolean',
  description: 'Allow usage of console.log and friends.',
  default: true
}).option('repl', {
  type: 'boolean',
  description: 'Listen for REPL connections.'
}).option('repl-port', {
  type: 'number',
  description: 'The port to listen for REPL connections on.',
  default: 3499
}).option('mas', {
  type: 'boolean',
  description: 'Run in Mac App Store release mode.'
}).option('version', {
  type: 'boolean',
  description: 'Print the app version.',
  alias: 'v'
}).option('squirrel-install', {
  type: 'boolean',
  description: 'Squirrel.Windows flag, called when the app is installed.'
}).option('squirrel-uninstall', {
  type: 'boolean',
  description: 'Squirrel.Windows flag, called after the app is updated.'
}).option('squirrel-updated', {
  type: 'boolean',
  description: 'Squirrel.Windows flag, called when the app is uninstalled.'
}).option('squirrel-obsolete', {
  type: 'boolean',
  description: 'Squirrel.Windows flag, called before updating to a new version.'
}).option('squirrel-firstrun', {
  type: 'boolean',
  description: 'Squirrel.Windows flag, called only once after installation.'
}).help('help', 'Print this help message.').alias('help', 'h').epilog('Coded with <3 by ' + global.manifest.author).argv;
options.mas = options.mas || !!process.mas;
options.portable = options.portable || !!global.manifest.portable;
options.debug = options.debug || !!process.env.DEBUG;
global.options = options;

// Log args
log('cli args parsed', JSON.stringify(options));

// Check for debug mode
if (options.debug) {
  log('running in debug mode');
}

// Check for mas mode
if (options.mas) {
  log('running in mas mode');
}

// Change the userData path if in portable mode
if (options.portable) {
  log('running in portable mode');
  const userDataPath = _filePaths.default.getCustomUserDataPath();
  log('setting userData path', userDataPath);
  _electron.app.setPath('userData', userDataPath);
}
(() => {
  if (checkSquirrelWindowsArgs()) return;
  if (quitIfPrefEnabled()) return;
  if (printVersionsAndExit()) return;
  if (enforceSingleInstance()) return;
  preReadySetup();
  initAndLaunch().catch(err => {
    log('init and launch failed');
    logFatal(err);
  });
  startRepl();
})();
function checkSquirrelWindowsArgs() {
  if (_platform.default.isWindows) {
    const SquirrelEvents = require('browser/components/squirrel-events').default;
    if (SquirrelEvents.check(options)) {
      log('Squirrel.Windows event detected');
      return true;
    }
  }
  return false;
}
function quitIfPrefEnabled() {
  if (_prefs.default.get('launch-quit')) {
    log('launch-quit pref is true, quitting');
    _prefs.default.unsetSync('launch-quit');
    _electron.app.quit();
    return true;
  }
  return false;
}
function printVersionsAndExit() {
  if (options.version) {
    console.log(`${_electron.app.getName()} ${_electron.app.getVersion()} (${global.manifest.buildNum})`);
    console.log(`Electron ${process.versions.electron}`);
    console.log(`Chromium ${process.versions.chrome}`);
    _electron.app.quit();
    return true;
  }
  return false;
}
function enforceSingleInstance() {
  const gotLock = _electron.app.requestSingleInstanceLock();
  if (!gotLock) {
    console.log('Another instance of ' + global.manifest.productName + ' is already running.');
    _electron.app.quit();
    return true;
  }
  _electron.app.on('second-instance', (event, argv, cwd) => {
    log('another instance tried to run argv:', argv, 'cwd:', cwd);
    if (global.application) {
      global.application.mainWindowManager.showOrCreate();
    }
  });
  return false;
}
function preReadySetup() {
  _electron.app.disableHardwareAcceleration(); // should be easier on the GPU
}
async function initAndLaunch() {
  try {
    await onAppReady();
    enableHighResResources();
  } catch (err) {
    logFatal(err);
    return;
  }
  log('launching app');
  const Application = require('browser/application').default;
  global.application = new Application();
  global.application.init();
  global.ready = true;
}
function startRepl() {
  if (options.repl) {
    const repl = require('browser/utils/repl');
    repl.createServer(options.replPort);
  }
}
async function onAppReady() {
  return await new Promise((resolve, reject) => {
    _electron.app.on('ready', () => {
      log('ready');
      resolve();
    });
  });
}

/**
 * @source https://github.com/sindresorhus/caprine/pull/172
 */
function enableHighResResources() {
  const scaleFactor = Math.max.apply(null, _electron.screen.getAllDisplays().map(scr => scr.scaleFactor));
  if (scaleFactor === 1) {
    return;
  }
  _electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    let cookie = details.requestHeaders.Cookie;
    if (cookie && details.method === 'GET' && details.url.startsWith('https://www.messenger.com/')) {
      if (cookie.match(/(; )?dpr=\d/)) {
        cookie = cookie.replace(/dpr=\d/, 'dpr=' + scaleFactor);
      } else {
        cookie = cookie + '; dpr=' + scaleFactor;
      }
      details.requestHeaders.Cookie = cookie;
    }
    callback({
      cancel: false,
      requestHeaders: details.requestHeaders
    });
  });
}