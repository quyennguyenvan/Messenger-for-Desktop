if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServer = createServer;
var _repl = _interopRequireDefault(require("repl"));
var _net = _interopRequireDefault(require("net"));
var _logger = _interopRequireDefault(require("common/utils/logger"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Create the server and start listening on the given port.
 */
function createServer(port) {
  log('listening for REPL connections on port', port);
  _net.default.createServer(socket => {
    const r = _repl.default.start({
      prompt: 'browser@' + global.manifest.name + '> ',
      input: socket,
      output: socket,
      terminal: true
    });
    r.on('exit', () => {
      socket.end();
    });

    // Bridge loggers
    r.context.log = _logger.default.debugLogger('repl');
    r.context.logError = _logger.default.errorLogger('repl', false);
    r.context.logFatal = _logger.default.errorLogger('repl', true);
  }).listen(port);
}