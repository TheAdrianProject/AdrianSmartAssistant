/**
 * @fileOverview Singleton Pattern.
 */

var Cip = require('./base');
var extend = require('./extend');
var cast = require('./cast');
var helpers = require('./helpers');

var sing = module.exports = {};


/**
 * The API extendSingleton.
 *
 * @param {...*} args Any type and number of arguments, view docs.
 * @return {Function} A child constructor.
 */
sing.extendSingleton = function() {
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
  cast.singleton(Ctor);
  cast.internal(Ctor, args, UserCtor);
  return Ctor;
};

/**
 * Returns a singleton instance of the provided Ctor.
 *
 * @return {Cip} The singleton instance for the provided Ctor.
 */
sing.getInstance = function() {
  var Ctor = helpers.getParentCtor(this);
  if (Ctor[Cip.KEY].singleton) {
    return Ctor[Cip.KEY].singleton;
  }
  var singleton = new Ctor();
  Ctor[Cip.KEY].singleton = singleton;
  return singleton;
};

// single time DI
cast.extendSingleton = sing.extendSingleton;
cast.getInstance = sing.getInstance;
