/**
 * @fileOverview CIP extend implementation.
 */

var Cip = require('./base');
var cast = require('./cast');
var helpers = require('./helpers');

var extend = module.exports = {};

/**
 * The API extend.
 *
 * @param {...*} args Any type and number of arguments, view docs.
 * @return {Function} A child constructor.
 */
extend.extend = function() {
  var args = Array.prototype.slice.call(arguments);

  // heuristics to determine child ctor and if this is a chained extend or not
  var ParentCtor = helpers.getParentCtor(this);
  var UserCtor = helpers.getChildCtor(args);

  //
  // Inheritance
  //
  var Ctor = extend.getCtor(UserCtor, ParentCtor, args);
  helpers.inherit(Ctor, ParentCtor);

  cast.core(Ctor);
  cast.internal(Ctor, args, UserCtor);
  return Ctor;
};
// single time DI
cast.extend = extend.extend;

/**
 * Return a new Constructor to use as base for extending.
 *
 * @param {Function} UserCtor User defined Ctor or noop.
 * @param {Function} ParentCtor Parent Ctor.
 * @param {Array} extendArgs Arguments passed to extend.
 */
extend.getCtor = function(UserCtor, ParentCtor, extendArgs) {
  /**
   * Build the wrapping Constructor.
   */
  function Ctor() {
    // Check if Ctor is singleton and not invoked by an ancestor.
    if (Ctor[Cip.KEY].isSingleton) {
      if (this.constructor[Cip.KEY].id !== Ctor[Cip.KEY].id) {
        if (Ctor[Cip.KEY].singleton) {
          return Ctor[Cip.KEY].singleton;
        }
      }
    }

    var ctorArgs = Array.prototype.slice.call(arguments);

    var parentArgs = helpers.calculateParentArgs(
      ParentCtor[Cip.KEY].UserCtor.length, extendArgs, ctorArgs);

    // invoke parent ctor
    ParentCtor.apply(this, parentArgs);

    // invoke all mixins
    var self = this;
    Ctor[Cip.KEY].mixins.forEach(function(Mixin) {
      Mixin.apply(self, parentArgs);
    });

    return UserCtor.apply(this, ctorArgs);
  };

  /**
   * Sign the Ctor.
   *
   * @return {string} The CIP signature.
   */
  Ctor.toString = function() {
    return 'CIP';
  };

  return Ctor;
};
