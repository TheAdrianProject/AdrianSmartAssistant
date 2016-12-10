/**
 * @fileOverview test custom hostname.
 */
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var isOnline = require('../../lib/is-online');

var netcheck = require('../..');

describe('Custom hostnames', function() {
  beforeEach(function () {
    netcheck.reset();
  });

  beforeEach(function () {
    this.isOnlineSpy = sinon.spy(isOnline, 'isReachable');
  });
  afterEach(function () {
    this.isOnlineSpy.restore();
  });

  it('should check connecvitity using custom hostname', function() {
    netcheck.setup({customHostname: 'www.google.com'});

    return netcheck.hasInternet()
      .bind(this)
      .then(function(online) {
        expect(online).to.be.true;
        expect(this.isOnlineSpy.calledOnce).to.be.true;
        expect(this.isOnlineSpy.args[0][0]).to.equal('www.google.com');
      });
  });
});
