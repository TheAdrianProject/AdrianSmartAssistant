/**
 * @fileOverview Base API Surface tests.
 */
var chai = require('chai');
var expect = chai.expect;

var netcheck = require('../..');

describe('Base API Surface', function() {
  it('should expose expected methods', function() {
    expect(netcheck).to.have.keys([
      'on',
      'once',
      'removeListener',
      'removeAllListeners',
      'init',
      'setup',
      'hasInternet',
      'hasLocal',
      'reset',
    ]);
  });
});
