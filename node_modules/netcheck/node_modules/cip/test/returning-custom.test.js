/**
 * @fileOverview Test constructors that return custom objects.
 */
var chai = require('chai');
var assert = chai.assert;

var Cip = require('../');

suite('Custom retuning object', function() {

  setup(function() {
    var instances = {};
    this.Ctor = Cip.extend(function(arg) {
      if (instances[arg]) {
        return instances[arg];
      }

      instances[arg] = this;

      this.value = 1;
    });
  });
  teardown(function() {});

  test('Will return the proper object', function() {
    var ctor = new this.Ctor('one');
    ctor.value++;

    var ctorClone = new this.Ctor('one');

    assert.equal(ctorClone.value, 2, 'Should get the right instance');
  });
});

