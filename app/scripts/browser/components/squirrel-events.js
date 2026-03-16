if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _electron = require("electron");
var _child_process = _interopRequireDefault(require("child_process"));
var _path = _interopRequireDefault(require("path"));
var _del = _interopRequireDefault(require("del"));
var _autoLauncher = _interopRequireDefault(require("browser/components/auto-launcher"));
var _filePaths = _interopRequireDefault(require("common/utils/file-paths"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class SquirrelEvents {
  check(options) {
    if (options.squirrelInstall) {
      log('creating shortcuts');
      this.spawnSquirrel('--createShortcut', this.getShortcutExeName()).then(this.exitApp);
      return true;
    }
    if (options.squirrelUpdated || options.squirrelObsolete) {
      setTimeout(this.exitApp);
      return true;
    }
    if (options.squirrelUninstall) {
      this.teardown().then(this.exitApp);
      return true;
    }
    return false;
  }
  getShortcutExeName() {
    return _path.default.basename(_electron.app.getPath('exe'));
  }
  exitApp(exitCode = 0) {
    _electron.app.exit(exitCode);
  }

  /**
   * Spawn Squirrel's Update.exe with the given arguments.
   */
  async spawnSquirrel(...args) {
    const squirrelExec = _filePaths.default.getSquirrelUpdateExePath();
    log('spawning', squirrelExec, args);
    const child = _child_process.default.spawn(squirrelExec, args, {
      detached: true
    });
    return await new Promise((resolve, reject) => {
      child.on('close', function (code) {
        if (code) {
          logError(new Error(squirrelExec + ' exited with code ' + code));
        }
        resolve(code || 0);
      });
    });
  }
  async teardown() {
    try {
      await this.teardownShortcuts();
    } catch (err) {
      logError(err, true);
    }
    try {
      await this.teardownAutoLauncherRegKey();
    } catch (err) {
      logError(err, true);
    }
    try {
      await this.teardownLeftoverUserData();
    } catch (err) {
      logError(err, true);
    }
    log('teardown finished');
  }
  async teardownShortcuts() {
    log('removing shortcuts');
    await this.spawnSquirrel('--removeShortcut', this.getShortcutExeName());
  }
  async teardownAutoLauncherRegKey() {
    log('removing reg keys');
    await new _autoLauncher.default().disable();
  }
  async teardownLeftoverUserData() {
    const userDataPath = _electron.app.getPath('userData');
    log('removing user data folder', userDataPath);
    await (0, _del.default)(_path.default.join(userDataPath, '**'), {
      force: true
    }).then(files => log('deleted', JSON.stringify(files)));
  }
}
var _default = exports.default = new SquirrelEvents();