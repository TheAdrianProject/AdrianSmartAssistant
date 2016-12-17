/**
 * @fileOverview The connectivity monitor.
 */

var EventEmitter = require('events').EventEmitter;

var cip = require('cip');
var _ = require('lodash');
var network = require('network');
var CEventEmitter = cip.cast(EventEmitter);

var isOnline = require('./is-online');

/**
 * The connectivity monitor.
 *
 * @constructor
 */
var Monitor = module.exports = CEventEmitter.extendSingleton(function () {
  /** @type {Boolean} Indicates if the monitor is active */
  this.isActive = false;

  /** @type {Boolean} Indicates if the first internet test was complete */
  this.internetTestComplete = false;
  /** @type {Boolean} Indicates if internet connectivity was detected */
  this.hasInternet = false;

  /** @type {Boolean} Indicates if the first local net test was complete */
  this.localTestComplete = false;
  /** @type {Boolean} Indicates if local net connectivity was detected */
  this.hasLocal = false;

  /** @type {?Object} Timeout instance for next check */
  this.timeoutInstance = null;

  /** @type {Object} The operating options */
  this.options = _.clone(Monitor.defaults);
});

/** @type {Object} Default options. */
Monitor.defaults = {
  monitorInternet: true,
  monitorLocal: true,
  intervalInternet: 60000,
  intervalLocal: 60000,
  customHostname: null,
};

/**
 * Start the connectivity monitor.
 *
 */
Monitor.prototype.init = function() {
  if (this.isActive) {
    return;
  }
  this.isActive = true;

  this._startInternetCheck();
  this._startLocalCheck();
};

/**
 * Perform the Internet connectivity check.
 *
 * @private
 */
Monitor.prototype._startInternetCheck = function() {
  if (!this.options.monitorInternet) {
    return;
  }

  isOnline(this.options.customHostname)
    .bind(this)
    .then(function(online) {
      var newState = !!online;
      if (newState !== this.hasInternet || !this.internetTestComplete) {
        this.emit('internet', newState);
      }
      this.hasInternet = newState;
      this.internetTestComplete = true;

      this.timeoutInstance = setTimeout(this._startInternetCheck.bind(this),
        this.options.intervalInternet);
    });
};

/**
 * Perform the local network connectivity check.
 *
 * @private
 */
Monitor.prototype._startLocalCheck = function() {
  if (!this.options.monitorLocal) {
    return;
  }

  var self = this;
  /* jshint camelcase:false */
  network.get_private_ip(function(err) {
    var newState = false;
    if (err) {
      newState = false;
    } else {
      newState = true;
    }
    if (newState !== self.hasLocal || !self.localTestComplete) {
      self.emit('local', newState);
    }
    self.hasLocal = newState;
    self.localTestComplete = true;

    setTimeout(self._startLocalCheck.bind(self), self.options.intervalLocal);
  });
};

/**
 * Reset this instance to its original state.
 *
 */
Monitor.prototype.reset = function() {
  clearTimeout(this.timeoutInstance);
  this.isActive = false;
  this.internetTestComplete = false;
  this.hasInternet = false;
  this.localTestComplete = false;
  this.hasLocal = false;
  this.options = _.clone(Monitor.defaults);
};
