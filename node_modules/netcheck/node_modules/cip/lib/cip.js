/**
 * @fileOverview CIP Classical Inheritance Pattern, the bootstrap module.
 * @author Thanasis Polychronakis 2014
 */
var Store = require('./store');

// Compose cip
var Cip = module.exports = require('./base');
Cip[Cip.KEY] = new Store('base');
Cip.extend = require('./extend').extend;
Cip.mixin = require('./mixin').mixin;
Cip.extendSingleton = require('./singleton').extendSingleton;
Cip.cast = require('./cast').cast;
