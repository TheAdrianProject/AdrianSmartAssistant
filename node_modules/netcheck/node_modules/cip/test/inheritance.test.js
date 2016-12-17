/*jshint unused:false */
/*jshint camelcase:false */
/**
 * @fileOverview Inheritance tests
 */
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var Cip = require('../');

function registerTests(extendMethod, singleton) {

  suite('Constructor tests', function() {
    setup(function() {});
    teardown(function() {});

    test('Extending with a constructor', function(done) {
      var Child = Cip[extendMethod](function() {
        done();
      });
      var child = new Child();
    });
    test('Can extend without a ctor', function(){
      assert.doesNotThrow(Cip[extendMethod]);
    });
    test(extendMethod + '() produces the expected static methods', function() {
      var Child = Cip[extendMethod]();
      assert.isFunction(Child.extend, 'extend');
      assert.isFunction(Child.extendSingleton, 'extendSingleton');
      assert.isFunction(Child.mixin, 'mixin');
      if (singleton) {
        assert.isFunction(Child.getInstance, 'getInstance');
      }
    });
    test('ctor "this" defined properties are Inherited', function() {
      var Child = Cip[extendMethod](function() {
        this.a = 1;
      });

      var GrandChild = Child[extendMethod]();
      var grandChild = new GrandChild();
      assert.property(grandChild, 'a');
      assert.equal(grandChild.a, 1);
    });
    test('ctor "this" defined properties have no side-effects', function() {
      var Child = Cip[extendMethod](function(){
        this.a = 1;
        this.obj = {
          b: 2,
        };
      });
      var child = new Child();
      child.a = 3;
      child.obj.b = 6;

      var GrandChild = Child[extendMethod]();
      var grandChild = new GrandChild();
      assert.property(grandChild, 'a');
      assert.property(grandChild, 'obj');
      assert.equal(grandChild.a, 1);
      assert.equal(grandChild.obj.b, 2);

      grandChild.a = 5;
      grandChild.obj.b = 9;
      assert.equal(child.a, 3);
      assert.equal(child.obj.b, 6);
    });

    test('Ctor will get correct signature in exceptions', function() {
      var child = Cip.extend();
      try {
        child.go();
      } catch(ex) {
        assert.equal(ex.message, 'Object CIP has no method \'go\'');
      }
    });
  });


  suite('Inheritance tests', function() {
    test('static methods are not Inherited', function(){
      var Child = Cip[extendMethod]();
      Child.astaticfn = function(){};

      var GrandChild = Child[extendMethod]();

      assert.notProperty(GrandChild, 'astaticfn');
    });
    test('prototype methods are Inherited', function() {
      var Child = Cip[extendMethod]();
      Child.prototype.add = function(a, b) { return a + b; };

      var GrandChild = Child[extendMethod]();
      var grandChild = new GrandChild();

      assert.isFunction(grandChild.add);
      assert.equal(grandChild.add(1,1), 2);
    });

    test('parent ctor is on "prototype.constructor"', function() {
      var Child = Cip[extendMethod]();
      var GrandChild = Child[extendMethod]();
      assert.equal(GrandChild.prototype.constructor, Child);
    });

    test('Constructors are invoked in the expected order', function() {
      var spyOne = sinon.spy();
      var spyTwo = sinon.spy();
      var spyThree = sinon.spy();
      var spyFour = sinon.spy();
      var spyFive = sinon.spy();

      var Child = Cip[extendMethod](spyOne);
      var GrandChild = Child[extendMethod](spyTwo);
      var GreatGrandChild = GrandChild[extendMethod](spyThree);
      var GreatGreatGrandChild = GreatGrandChild[extendMethod](spyFour);
      var GreatGreatGreatGrandChild = GreatGreatGrandChild[extendMethod](spyFive);

      var g = new GreatGreatGreatGrandChild();

      assert.ok(spyOne.calledBefore(spyTwo), 'Child called before GrandChild');
      assert.ok(spyTwo.calledBefore(spyThree), 'GrandChild called before GreatGrandChild');
      assert.ok(spyThree.calledBefore(spyFour), 'GreatGrandChild called before GreatGreatGrandChild');
      assert.ok(spyFour.calledBefore(spyFive), 'GreatGreatGrandChild called before GreatGreatGreatGrandChild');
    });
  });
}

suite('Typical Inheritance', function() {
  registerTests('extend', false);
});
suite('Singleton Inheritance', function() {
  registerTests('extendSingleton', true);
});
