/*jshint camelcase:false */
/**
 * @fileOverview CIP Wrapper.
 */

var Cip = require('./base');
var Store = require('./store');
var helpers = require('./helpers');
var mixin = require('./mixin');

var cast = module.exports = {};

/** @type {?Function} extend() fn, single time DI by extend module */
cast.extend = null;
/** @type {?Function} extendSingleton() fn, single time DI by singleton module */
cast.extendSingleton = null;
/** @type {?Function} getSingleton() fn, single time DI by singleton module */
cast.getSingleton = null;

/**
 * Cast a vanilla Constructor to CIP.
 *
 * @param {Function} Ctor The Constructor to augment.
 * @return {Function} The Ctor augmented but not required, passed Ctor gets
 *   mutated anyway.
 */
cast.cast = function(Ctor) {
  /** @constructor */
  function Clone() {
    Ctor.apply(this, arguments);
  }
  helpers.inherit(Clone, Ctor);

  return cast.core(Clone);
};

/**
 * Add Cip Core static methods
 *
 * @param {Function} Ctor The Constructor to augment, WARNING function gets
 *   mutated by design.
 * @return {Function} The same Ctor augmented.
 */
cast.core = function(Ctor) {
  if (Cip.is(Ctor)) {
    return Ctor;
  }

  // partially apply extend to singleton instance
  Ctor.extend = cast.extend;
  Ctor.extendSingleton = cast.extendSingleton;
  Ctor.mixin = mixin.mixin;
  Ctor[Cip.KEY] = new Store();

  return Ctor;
};

/**
 * Add Cip singleton static methods.
 *
 * @param {Function} Ctor The Constructor to augment, WARNING function gets
 *   mutated by design.
 * @return {Function} The same Ctor augmented.
 */
cast.singleton = function(Ctor) {
  Ctor.getInstance = cast.getInstance;
  Ctor[Cip.KEY].isSingleton = true;
  return Ctor;
};


/**
 * Store internal arguments.
 *
 * @param {Function} Ctor The Constructor to augment, WARNING function gets
 *   mutated by design.
 * @param {Array} stubbedArgs An array of arguments to stub the Ctor with.
 * @param {Function} ChildCtor The actual child ctor (used internally by extend()).
 * @return {Function} The Ctor augmented.
 */
cast.internal = function(Ctor, stubbedArgs, ChildCtor) {
  Ctor[Cip.KEY].stubbedArgs = stubbedArgs;
  Ctor[Cip.KEY].UserCtor = ChildCtor;
  return Ctor;
};
