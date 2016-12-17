/**
 * @fileOverview CIP mixins implementation.
 */

var Cip = require('./base');
var helpers = require('./helpers');

var mixin = module.exports = {};

/**
 * Mixin implementation.
 *
 * @param {...Function|...Cip} args any number of args with Ctors to Mixin.
 */
mixin.mixin = function() {
  var Ctor = helpers.getParentCtor(this);
  var mixinCtors = Array.prototype.slice.call(arguments);

  mixinCtors.forEach(function(MixinCtor) {
    Ctor[Cip.KEY].mixins.push(MixinCtor);
    helpers.assign(Ctor.prototype, MixinCtor.prototype);
  });
};
