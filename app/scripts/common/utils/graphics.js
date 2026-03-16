if (process.type === 'browser') { try { require('source-map-support').install(); } catch(ignored) {} }
var log = require('common/utils/logger').debugLogger(__filename); var logError = require('common/utils/logger').errorLogger(__filename, false); var logFatal = require('common/utils/logger').errorLogger(__filename, true);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function createBadgeDataUrl(text) {
  const canvas = document.createElement('canvas');
  canvas.height = 140;
  canvas.width = 140;
  const context = canvas.getContext('2d');
  context.fillStyle = 'red';
  context.beginPath();
  context.ellipse(70, 70, 70, 70, 0, 0, 2 * Math.PI);
  context.fill();
  context.textAlign = 'center';
  context.fillStyle = 'white';
  if (text.length > 2) {
    context.font = 'bold 65px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 95);
  } else if (text.length > 1) {
    context.font = 'bold 85px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 100);
  } else {
    context.font = 'bold 100px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 105);
  }
  return canvas.toDataURL();
}
var _default = exports.default = {
  createBadgeDataUrl
};