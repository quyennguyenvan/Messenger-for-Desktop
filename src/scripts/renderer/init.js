const remote = require('@electron/remote');
const path = require('path');

export function inject (scope) {
  const remoteModule = remote && remote.app ? remote : require('@electron/remote');

  global.manifest = remoteModule.getGlobal('manifest');
  global.options = remoteModule.getGlobal('options');

  const appPath = remoteModule.app.getAppPath();
  const {addPath} = require(path.join(appPath, 'node_modules', 'app-module-path'));

  addPath(path.join(appPath, 'scripts'));
  addPath(path.join(appPath, 'node_modules'));

  // Add loggers to be used in the console
  const logger = require('common/utils/logger');
  window.log = logger.debugLogger('console:' + scope);
  window.logError = logger.errorLogger('console:' + scope, false);
  window.logFatal = logger.errorLogger('console:' + scope, true);

  // Handle errors
  window.onerror = function (message, source, lineno, colno, error) {
    window.logError(error instanceof Error ? error : new Error(error || message));
  };
}
