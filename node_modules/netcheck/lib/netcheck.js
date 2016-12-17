/*
 * netcheck
 * Will monitor Internet and local network connectivity and inform about their state.
 * https://github.com/INSIGHTReplay/netcheck
 *
 * Copyright ©2015 Insight Replay, Inc.
 * Licensed under the MIT license.
 * @author Thanasis Polychronakis
 */
var _ = require('lodash');
var Promise = require('bluebird');
var network = require('network');

var isOnline = require('./is-online');
var monitor = require('./monitor').getInstance();

/**
 * @fileOverview netcheck Base.
 */
var netcheck = module.exports = {};

netcheck.on = monitor.on.bind(monitor);
netcheck.once = monitor.once.bind(monitor);
netcheck.removeListener = monitor.removeListener.bind(monitor);
netcheck.removeAllListeners = monitor.removeAllListeners.bind(monitor);

/**
 * Start the network monitors.
 *
 */
netcheck.init = function() {
  monitor.init();
};

/**
 * Setup netcheck.
 *
 * @param {Object} options User defined options.
 */
netcheck.setup = function(options) {
  monitor.options = _.defaults(options, monitor.options);
};

/**
 * Resets all states.
 *
 */
netcheck.reset = function() {
  monitor.reset();
  netcheck.removeAllListeners();
};

/**
 * Checks if Internet connectivity exists.
 *
 * @return {Promise(Boolean)} A Promise with the boolean result.
 */
netcheck.hasInternet = Promise.method(function() {
  if (monitor.isActive) {
    // Monitor is active, check if tests are complete or wait for them.
    if (monitor.internetTestComplete) {
      return monitor.hasInternet;
    } else {
      return new Promise(function(resolve) {
        monitor.once('internet', function(isConnected) {
          resolve(isConnected);
        });
      });
    }
  } else {
    // Monitor is not running, invoke the test here.
    return isOnline(monitor.options.customHostname);
  }
});

/**
 * Checks if Local Network connectivity exists.
 *
 * @return {Promise(Boolean)} A Promise with the boolean result.
 */
netcheck.hasLocal = Promise.method(function() {
  if (monitor.isActive) {
    // Monitor is active, check if tests are complete or wait for them.
    if (monitor.localTestComplete) {
      return monitor.hasLocal;
    } else {
      return new Promise(function(resolve) {
        monitor.once('local', function(isConnected) {
          resolve(isConnected);
        });
      });
    }
  } else {
    // Monitor is not running, invoke the test here.
    return new Promise(function(resolve) {
      /* jshint camelcase:false */
      network.get_private_ip(function(err) {
        resolve(!err);
      });
    });
  }
});
