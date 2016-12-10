/**
 * @fileOverview Wrapper implementation for is online check.
 */

var Promise = require('bluebird');

var isOnlineLib = Promise.promisify(require('is-online'));
var isReachable = Promise.promisify(require('is-reachable'));

/**
 * Wrapper implementation for is online check.
 *
 * @param {?string} customHostname set hostname to reach.
 * @return {Promise(boolean)} A Promise with boolean value.
 */
var isOnline = module.exports = Promise.method(function(customHostname) {
  if (!customHostname) {
    return isOnline.isOnline();
  } else {
    return isOnline.isReachable(customHostname);
  }
});

/**
 * Perform generic is online operation.
 *
 * @return {Promise(boolean)} A Promise with boolean value.
 */
isOnline.isOnline = Promise.method(function() {
  return isOnlineLib();
});

/**
 * Perform an is-reachable operation using hostname.
 *
 * @param {string} customHostname The hostname to use.
 * @return {Promise(boolean)} A Promise with boolean value.
 */
isOnline.isReachable = Promise.method(function(customHostname) {
  return isReachable(customHostname);
});
