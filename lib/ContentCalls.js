/* CONTENT CALLS
 * These chaps are mixed on to a target object, but can be run independently by setting
 * a path mapper and logger. */
'use strict';

  /* CONSTANTS */
var INJECTED_PROPERTIES = [
    'pathMapper',
    'logger'
  ],
  UNMIXED_PROPERTIES = [
    'mixInTo',
    'setPathMapper', // For testing calls in isolation
    'setLogger' // For testing calls in isolation
  ].concat(INJECTED_PROPERTIES); // Injected properties are not mixed either

/* INJECTED PROPERTIES AND THEIR SETTERS */
exports.pathMapper = null;
exports.logger = null;

exports.setPathMapper = function (pathMapper) {
  this.pathMapper = pathMapper;
};

exports.setLogger = function (logger) {
  this.logger = logger;
};

/* MIXING IN */
exports.mixInTo = function (mixee) {
  var contentCallsProperty;

  // Ensure we have our injected properties on the mixee
  INJECTED_PROPERTIES.forEach(function (propertyName) {
    if (!mixee[propertyName]) {
      throw new TypeError('Content Calls can only be mixed in to an object with a ' +
        propertyName + ' property.');
    }
  });

  // Then for each of our properties that aren't unmixed, add them
  for (contentCallsProperty in exports) {
    if (exports.hasOwnProperty(contentCallsProperty) &&
      UNMIXED_PROPERTIES.indexOf(contentCallsProperty) === -1) {
      mixee[contentCallsProperty] = exports[contentCallsProperty];
    }
  }
};