var chai = require('chai');
var assert = chai.assert;

var Cip = require('../');

/*
  ======== A Handy Little Mocha Reference ========
  https://github.com/visionmedia/mocha/

  Test assertions:
    assert.fail(actual, expected, message, operator)
    assert(value, message), assert.ok(value, [message])
    assert.equal(actual, expected, [message])
    assert.notEqual(actual, expected, [message])
    assert.deepEqual(actual, expected, [message])
    assert.notDeepEqual(actual, expected, [message])
    assert.strictEqual(actual, expected, [message])
    assert.notStrictEqual(actual, expected, [message])
    assert.throws(block, [error], [message])
    assert.doesNotThrow(block, [message])
    assert.ifError(value)

    Apart from assert, Mocha allows you to use any of the following assertion libraries:
    - should.js
    - chai
    - expect.js
    - better-assert
*/

// var noop = function(){};

setup(function() {});
teardown(function() {});

suite('API Surface', function() {
  test('Exported Methods', function() {
    assert.isFunction(Cip, 'Cip core is a "constructor"');
    assert.isFunction(Cip.extend, 'Cip should have an "extend" static method');
    assert.isFunction(Cip.extendSingleton, 'Cip should have an "extendSingleton" static method');
    assert.isFunction(Cip.is, 'Cip should have a "is" static method');
    assert.isFunction(Cip.cast, 'Cip should have a "cast" static method');
  });
});


suite('is() function', function() {
  test('identifies core as Cip', function() {
    assert.ok(Cip.is(Cip));
  });
  test('identifies extended class as Cip', function() {
    var Child = Cip.extend();
    assert.ok(Cip.is(Child));
  });
  test('identifies extended class with ctor as Cip', function() {
    var Child = Cip.extend(function(){});
    assert.ok(Cip.is(Child));
  });
  test('identifies extended classes as Cip down 10 levels', function() {
    var howDeep = 10;
    function recurse(Parent) {
      var Child = Parent.extend();
      assert.ok(Cip.is(Child), 'Child at level ' + howDeep + ' should yield true for inCip()');

      if (--howDeep) {
        recurse(Child);
      }
    }
    recurse(Cip);
  });

});
