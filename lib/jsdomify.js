'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsdom = require('jsdom');

var actualDOM = void 0;
var documentRef = void 0;
var exposedProperties = ['window', 'navigator', 'document'];

var create = function create(domString) {
  actualDOM = domString || '';
  global.document = (0, _jsdom.jsdom)(actualDOM);
  global.window = document.defaultView;
  Object.keys(document.defaultView).forEach(function (property) {
    if (typeof global[property] === 'undefined') {
      exposedProperties.push(property);
      global[property] = document.defaultView[property];
    }
  });

  global.navigator = {
    userAgent: 'node.js'
  };

  documentRef = document;
};

var destroy = function destroy(clearRequireCache) {
  var clearCache = typeof clearRequireCache === 'undefined' ? true : clearRequireCache;

  if (typeof global.window !== 'undefined') {
    global.window.close();
  }
  documentRef = undefined;
  exposedProperties.forEach(function (property) {
    delete global[property];
  });

  if (clearCache) {
    Object.keys(require.cache).forEach(function (key) {
      if (key.indexOf('require') !== -1) {
        delete require.cache[key];
      }
    });
  }
};

var clear = function clear() {
  destroy();
  create(actualDOM);
};

var getDocument = function getDocument() {
  if (typeof documentRef === 'undefined') {
    throw new Error('document is undefined\nTry calling jsdomify.create() before requesting it\n');
  }

  return documentRef;
};

exports.default = {
  create: create,
  clear: clear,
  destroy: destroy,
  getDocument: getDocument
};