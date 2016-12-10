/*jshint unused:false */
/*jshint camelcase:false */
/**
 * @fileOverview extend argument tests
 */
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var Cip = require('../');

suite('Constructor arguments tests', function() {
  test('Constructors can accept arguments', function() {
    var Child = Cip.extend(function(arg1, arg2) {
      this.a = arg1;
      this.b = arg2;
    });

    var child = new Child(1, 2);
    var childTwo = new Child(3, 4);

    assert.equal(child.a, 1);
    assert.equal(child.b, 2);
    assert.equal(childTwo.a, 3);
    assert.equal(childTwo.b, 4);
  });
  test('Constructor arguments can be stubbed by childs', function() {
    var Child = Cip.extend(function(arg1, arg2) {
      this.a = arg1;
      this.b = arg2;
    });

    var GrandChild = Child.extend(5, 6, function(arg3) {
      this.c = arg3;
    });

    var grandChild = new GrandChild('lol');
    var grandChildTwo = new GrandChild(0);

    assert.equal(grandChild.a, 5);
    assert.equal(grandChild.b, 6);
    assert.equal(grandChild.c, 'lol');
    assert.equal(grandChildTwo.a, 5);
    assert.equal(grandChildTwo.b, 6);
    assert.equal(grandChildTwo.c, 0);
  });
  test('2 Constructor arguments can be partially stubbed by childs', function() {
    var Child = Cip.extend(function(arg1, arg2) {
      this.a = arg1;
      this.b = arg2;
    });

    var GrandChild = Child.extend(5, function(arg2, arg3) {
      this.c = arg3;
    });

    var grandChild = new GrandChild(9, 'lol');
    var grandChildTwo = new GrandChild(8, 0);

    assert.equal(grandChild.a, 5);
    assert.equal(grandChild.b, 9);
    assert.equal(grandChild.c, 'lol');
    assert.equal(grandChildTwo.a, 5);
    assert.equal(grandChildTwo.b, 8);
    assert.equal(grandChildTwo.c, 0);
  });

  test('3 Constructor arguments can be compositevely stubbed by childs', function() {
    var Child = Cip.extend(function(arg1, arg2) {
      this.a = arg1;
      this.b = arg2;
    });

    var GrandChild = Child.extend(5, function(arg2, arg3) {
      this.b = arg2;
      this.c = arg3;
    });

    var GreatGrandChild = GrandChild.extend(6);

    var greatGrandChild = new GreatGrandChild('lol');
    var greatGrandChildTwo = new GreatGrandChild(0);

    assert.equal(greatGrandChild.a, 5);
    assert.equal(greatGrandChild.b, 6);
    assert.equal(greatGrandChild.c, 'lol');
    assert.equal(greatGrandChildTwo.a, 5);
    assert.equal(greatGrandChildTwo.b, 6);
    assert.equal(greatGrandChildTwo.c, 0);
  });


  test('Constructor stubbed arguments do not get confused with fn as args', function() {
    var Child = Cip.extend(function(arg1, arg2) {
      this.a = arg1;
      this.b = arg2;
    });

    var GrandChild = Child.extend(function(){this.b++;}, 6, function(arg3) {
      this.c = arg3;
    });

    var grandChild = new GrandChild('lol');
    var grandChildTwo = new GrandChild(0);

    assert.isFunction(grandChild.a);
    grandChild.a();
    assert.equal(grandChild.b, 7);
    assert.equal(grandChild.c, 'lol');
    assert.isFunction(grandChildTwo.a);
    grandChildTwo.a();
    grandChildTwo.a();
    assert.equal(grandChildTwo.b, 8);
    assert.equal(grandChildTwo.c, 0);
  });
  test('Constructor stubbed arguments can omit ctor', function() {
    var Child = Cip.extend(function(arg1, arg2) {
      this.a = arg1;
      this.b = arg2;
    });

    var GrandChild = Child.extend(function(){this.b++;}, 6);

    var grandChild = new GrandChild();
    var grandChildTwo = new GrandChild();

    assert.isFunction(grandChild.a);
    grandChild.a();
    assert.equal(grandChild.b, 7);
    assert.isFunction(grandChildTwo.a);
    grandChildTwo.a();
    grandChildTwo.a();
    assert.equal(grandChildTwo.b, 8);
  });
});
