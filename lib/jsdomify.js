'use strict';

var _jsdom = require('jsdom');

var actualDOM = undefined;

var create = function create(domString) {

  actualDOM = domString || '';
  global.document = (0, _jsdom.jsdom)(actualDOM);
  global.window = document.defaultView;
  global.Element = window.Element;
  global.navigator = {
    userAgent: 'node.js'
  };

  // shim document.classList
  require('./classList')(global.window);
};

var clear = function clear() {
  destroy();
  create(actualDOM);
};

var destroy = function destroy(clearRequireCache) {

  if (typeof clearRequireCache === 'undefined') {
    clearRequireCache = true;
  }

  window.close();
  delete global.document;

  if (clearRequireCache) {
    Object.keys(require.cache).forEach(function (key) {
      if (key.indexOf('require') !== -1) {
        delete require.cache[key];
      }
    });
  }
};

module.exports = {
  create: create,
  clear: clear,
  destroy: destroy
};