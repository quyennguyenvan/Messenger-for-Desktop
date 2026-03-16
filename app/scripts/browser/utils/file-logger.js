"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeLog = writeLog;
var _stripAnsi = _interopRequireDefault(require("strip-ansi"));
var _fsExtraPromise = _interopRequireDefault(require("fs-extra-promise"));
var _electron = require("electron");
var _util = _interopRequireDefault(require("util"));
var _path = _interopRequireDefault(require("path"));
var _os = _interopRequireDefault(require("os"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
let fileLogStream = null;
let fileLogIsGettingReady = false;
let fileLogIsReady = false;
function isFileLogEnabled() {
  return global.options.debug && !global.options.mas;
}
function initFileLogging() {
  if (fileLogIsGettingReady) {
    return;
  }
  fileLogIsGettingReady = true;
  try {
    const fileLogsDir = _path.default.join(_electron.app.getPath('userData'), 'logs');
    _fsExtraPromise.default.mkdirsSync(fileLogsDir);
    const fileLogPath = _path.default.join(fileLogsDir, Date.now() + '.txt');
    fileLogStream = _fsExtraPromise.default.createWriteStream(null, {
      fd: _fsExtraPromise.default.openSync(fileLogPath, 'a')
    });
    global.__debug_file_log_path = fileLogPath;
    process.on('exit', code => {
      fileLogStream.end('process exited with code ' + code + _os.default.EOL);
      fileLogStream = null;
    });
    if (global.options.consoleLogs) {
      console.log(`saving logs to "${fileLogPath}"`);
    }
    fileLogIsReady = true;
    fileLogIsGettingReady = false;
  } catch (err) {
    fileLogIsGettingReady = false;
    if (global.options.consoleLogs) {
      console.error('logger error:', err);
    }
  }
}
function writeLog() {
  if (isFileLogEnabled() && !fileLogIsReady) {
    initFileLogging();
  }
  if (fileLogStream) {
    fileLogStream.write((0, _stripAnsi.default)(_util.default.format(...arguments)) + _os.default.EOL);
  }
}