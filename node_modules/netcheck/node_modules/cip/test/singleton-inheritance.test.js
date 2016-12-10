/*jshint unused:false */
/*jshint camelcase:false */
/**
 * @fileOverview Singleton Inheritance specific tests
 */
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var Cip = require('../');

suite('Singleton inheritance', function() {
  test('"new" and "getInstance()" return the same instance', function() {
    var Child = Cip.extendSingleton(function() {
      this.a = 1;
    });
    var child = Child.getInstance();
    child.a++;
    var samechild = new Child();
    assert.equal(samechild.a, 2);
  });

  test('extendSingleton() singleton has a reference to the ctor prototype', function() {
    var child = Cip.extendSingleton().getInstance();
    assert.instanceOf(child, Cip);
  });

  test('extendSingleton() after 1 extend', function() {
    var Child = Cip.extend();
    var ChildSingleton = Child.extendSingleton();
    assert.isFunction(ChildSingleton.getInstance);
  });
  test('extendSingleton() after 2 extend2', function() {
    var Child = Cip.extend();
    var GrandChild = Child.extend();
    var GrandChildSingleton = GrandChild.extendSingleton();
    assert.isFunction(GrandChildSingleton.getInstance);
  });

  test('extendSingleton() extended by another extendSingleton()', function() {
    var Child = Cip.extend();
    var GrandChild = Child.extend();
    var GrandChildSingleton = GrandChild.extendSingleton(function() {
      this.a = 'alpha';
      this.b = 2;
    });
    GrandChildSingleton.prototype.add = function(arg) {
      return this.b + arg;
    };

    var LastStop = GrandChildSingleton.extendSingleton(function() {
      assert.equal(this.a, 'alpha');
    });

    var grandChildSingleton = GrandChildSingleton.getInstance();
    GrandChildSingleton.getInstance();
    var lastStop = LastStop.getInstance();
    assert.isFunction(lastStop.add);
    assert.equal(lastStop.add(2), 4);
  });

});
