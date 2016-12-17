/**
 * @fileOverview CIP Classical Inheritance Pattern
 * @author Thanasis Polychronakis 2014
 */
var noop = function(){};

/**
 * The base constructor.
 *
 * @constructor
 */
var Cip = module.exports = noop;

/** @const {string} Cip's private property */
Cip.KEY = '__cip';

/**
 * Helper storage for Cip
 * @type {?Object}
 * @private
 */
Cip[Cip.KEY] = null;

/**
 * Check if a Ctor is of Cip origin.
 *
 * @param {Function} Ctor the constructor to examine.
 * @return {boolean} yes / no.
 */
Cip.is = function(Ctor) {
  return !!Ctor[Cip.KEY];
};
