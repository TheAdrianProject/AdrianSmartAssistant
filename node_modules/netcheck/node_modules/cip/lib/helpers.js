/**
 * @fileOverview Utility helpers.
 */
var Cip = require('./base');

var helpers = module.exports = {};

function noop() {}

/**
 * A simple implementation to clone objects
 *
 * @param {Object} dest Target Object
 * @param {Object} source Source Object
 */
helpers.assign = function assign(dest, source) {
  Object.keys(source).reduce(function(proto, key) {
      proto[key] = source[key];
      return proto;
    }, dest);
};


/**
 * Generate a random string.
 *
 * @param  {number=} optLength How long the string should be, default 8.
 * @return {string} a random string.
 */
helpers.generateRandomString = function generateRandomString(optLength) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var length = optLength || 8;
  var string = '';
  var randomNumber = 0;
  for (var i = 0; i < length; i++) {
    randomNumber = Math.floor(Math.random() * chars.length);
    string += chars.substring(randomNumber, randomNumber + 1);
  }
  return string;
};

/**
 * Apply an array of arguments to a new instance.
 *
 * @param {Function} Ctor The constructor to instanciate.
 * @param {...*} Any number of any type args.
 * @return {Object} An instance of Ctor.
 */
helpers.applyArgsToCtor = function(Ctor) {
  var args = Array.prototype.slice.call(arguments, 1);
  var instance = Object.create(Ctor.prototype);
  instance.constructor = Ctor;
  Ctor.apply(instance, args);
  return instance;
};

/**
 * Object.create() Prototypical Inheritance.
 *
 * @param {Function} ChildCtor The Child Ctor.
 * @param {Function} ParentCtor The Parent Ctor.
 */
helpers.inherit = function(ChildCtor, ParentCtor) {
  ChildCtor.prototype = Object.create(ParentCtor.prototype);
  ChildCtor.prototype.constructor = ParentCtor;
};

/**
 * Partially apply arguments to a function.
 *
 * @param {Function} fn The function.
 * @param {...*} Any number of arguments of any type to apply.
 * @return {Function} The function with the arguments partially applied.
 */
helpers.partial = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var callArgs = Array.prototype.slice.call(arguments);
    fn.apply(null, args.concat(callArgs));
  };
};

/**
 * Calculates Parent arguments.
 *
 * @param {number} arity The arity of the user defined ctor function.
 * @param {Array} extendArgs Arguments passed to extend that will stub the
 *   parent's constructor arguments.
 * @param {Array} ctorArgs Arguments passed while instantiating the child ctor.
 * @return {Array} An array with the proper arguments to pass to ParentCtor.
 * @static
 */
helpers.calculateParentArgs = function(arity, extendArgs, ctorArgs) {
  var extendArgsLen = extendArgs.length;

  if (extendArgsLen === 0) {
    return ctorArgs;
  }

  // check if extendArgs are enough for parent
  if (arity <= extendArgsLen) {
    return extendArgs;
  }

  var borrowArgsFromCtor = ctorArgs.slice(0, arity - extendArgsLen);

  return extendArgs.concat(borrowArgsFromCtor);
};

/**
 * Determine the parent constructor based on retained context.
 *
 * @param {Function|Object} Ctor The context of the invoked static helper,
 *   extend(), mixin() and getInstance(), should be the Ctor.
 * @return {Function} a function to use as Parent Constructor.
 */
helpers.getParentCtor = function(Ctor) {
  if (!Cip.is(Ctor)) {
    return Cip;
  } else {
    return Ctor;
  }
};

/**
 * Determine the Child constructor based on arguments passed to extend().
 *
 * @param {Array} args arguments Warning: Mutates passed array by design.
 * @return {Function} a ctor.
 */
helpers.getChildCtor = function(args) {
  var argsLen = args.length;
  if (argsLen) {
    if (typeof(args[argsLen -1]) === 'function') {
      return args.pop();
    } else {
      return noop;
    }
  } else {
    return noop;
  }
};
