/*jshint unused:false */
/*jshint camelcase:false */
/**
 * @fileOverview mixins tests
 */
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var Cip = require('../');
function registerTests(extend, singleton) {
  suite('Mixins tests', function() {
    test('Mixin ctor gets invoked', function(done) {
      var Child = Cip[extend](function() {
        this.a = 1;
      });
      var ChildToMixin = Cip[extend](done);
      Child.mixin(ChildToMixin);

      if (singleton) {
        Child.getInstance();
      } else {
        var child = new Child();
      }
    });
    test('Instance shares same context with mixin', function() {
      var Child = Cip[extend](function() {
        this.a = 1;
      });
      var ChildToMixin = Cip[extend](function() {
        this.b = 2;
      });
      Child.mixin(ChildToMixin);

      var child = new Child();

      assert.equal(child.a, 1);
      assert.equal(child.b, 2);
    });

    test('Ctor passes the mixin', function() {
      var Child = Cip[extend](function() {
        this.a = 1;
      });

      var ChildToMixin = Cip[extend](function() {
        this.b = 2;
      });

      Child.mixin(ChildToMixin);

      var GrandChild = Child[extend](function() {
        this.c = 3;
      });

      var grandChild = new GrandChild();

      assert.equal(grandChild.a, 1);
      assert.equal(grandChild.b, 2);
      assert.equal(grandChild.c, 3);
    });
    test('mixin invokes ctors in the right order', function() {
      var spyChild = sinon.spy();
      var spyMixinOne = sinon.spy();
      var spyMixinTwo = sinon.spy();
      var spyMixinThree = sinon.spy();
      var spyGrandChild = sinon.spy();

      var Child = Cip[extend](spyChild);

      var ChildToMixin = Cip[extend](spyMixinOne);
      var ChildToMixinTwo = Cip[extend](spyMixinTwo);
      var ChildToMixinThree = Cip[extend](spyMixinThree);

      Child.mixin(ChildToMixin, ChildToMixinTwo, ChildToMixinThree);

      var GrandChild = Child[extend](spyGrandChild);

      var grandChild = new GrandChild();

      assert.ok(spyMixinOne.calledBefore(spyMixinTwo), 'spyMixinOne() before spyMixinTwo()');
      assert.ok(spyMixinTwo.calledBefore(spyMixinThree), 'spyMixinTwo() before spyMixinThree()');
      assert.ok(spyMixinThree.calledBefore(spyChild), 'spyMixinThree() before spyChild()');
      assert.ok(spyChild.calledBefore(spyGrandChild), 'spyChild() before spyGrandChild()');
    });

    test('Complex Mixin Constructors are invoked in the expected order', function() {
      var spyOne = sinon.spy();
      var spyTwo = sinon.spy();
      var spyThree = sinon.spy();
      var spyFour = sinon.spy();
      var spyFive = sinon.spy();
      var spyMixinOne = sinon.spy();
      var spyMixinTwo = sinon.spy();
      var spyMixinThree = sinon.spy();
      var spyMixinFour = sinon.spy();
      var spyMixinFive = sinon.spy();


      var Mixin = Cip[extend](spyMixinOne);
      var MixinTwo = Cip[extend](spyMixinTwo);
      var MixinThree = Cip[extend](spyMixinThree);
      var MixinFour = Cip[extend](spyMixinFour);
      var MixinFive = Cip[extend](spyMixinFive);

      var Child = Cip[extend](spyOne);
      Child.mixin(Mixin);

      var GrandChild = Child[extend](spyTwo);
      GrandChild.mixin(MixinTwo, MixinThree);

      var GreatGrandChild = GrandChild[extend](spyThree);

      var GreatGreatGrandChild = GreatGrandChild[extend](spyFour);
      GreatGreatGrandChild.mixin(MixinFour, MixinFive);

      var GreatGreatGreatGrandChild = GreatGreatGrandChild[extend](spyFive);


      var g = new GreatGreatGreatGrandChild();

      assert.ok(spyMixinOne.calledBefore(spyOne), 'Mixin() before Child()');
      assert.ok(spyOne.calledBefore(spyMixinTwo), 'Child() before MixinTwo()');
      assert.ok(spyMixinTwo.calledBefore(spyMixinThree), 'MixinTwo() before MixinThree()');
      assert.ok(spyMixinThree.calledBefore(spyTwo), 'spyMixinThree() before GrandChild()');
      assert.ok(spyTwo.calledBefore(spyThree), 'GrandChild() called before GreatGrandChild()');
      assert.ok(spyThree.calledBefore(spyMixinFour), 'GreatGrandChild() called before MixinFour()');
      assert.ok(spyMixinFour.calledBefore(spyMixinFive), 'MixinFour() called before MixinFive()');
      assert.ok(spyMixinFive.calledBefore(spyFour), 'MixinFive() called before GreatGreatGrandChild()');
      assert.ok(spyFour.calledBefore(spyFive), 'GreatGreatGrandChild called before GreatGreatGreatGrandChild');
    });


    test('mixin ctors share the same context', function() {
      var Child = Cip[extend](function() {
        this.a = 1;
      });

      var ChildToMixin = Cip[extend](function() {this.b = 2;});
      var ChildToMixinTwo = Cip[extend](function() {this.c = 3;});
      var ChildToMixinThree = Cip[extend](function() {this.d = 4;});

      Child.mixin(ChildToMixin, ChildToMixinTwo, ChildToMixinThree);

      var GrandChild = Child[extend](function() {
        this.e = 5;
      });

      var grandChild = new GrandChild();

      assert.equal(grandChild.a, 1);
      assert.equal(grandChild.b, 2);
      assert.equal(grandChild.c, 3);
      assert.equal(grandChild.d, 4);
      assert.equal(grandChild.e, 5);
    });
    test('mixin accepts comma separated ctors', function() {
      var Child = Cip[extend](function() {
        this.a = 1;
      });

      var ChildToMixin = Cip[extend](function() {this.b = 2;});
      var ChildToMixinTwo = Cip[extend](function() {this.c = 3;});
      var ChildToMixinThree = Cip[extend](function() {this.d = 4;});

      Child.mixin(ChildToMixin, ChildToMixinTwo, ChildToMixinThree);

      var GrandChild = Child[extend](function() {
        this.e = 5;
      });

      var grandChild = new GrandChild();

      assert.equal(grandChild.a, 1);
      assert.equal(grandChild.b, 2);
      assert.equal(grandChild.c, 3);
      assert.equal(grandChild.d, 4);
      assert.equal(grandChild.e, 5);
    });
    test('We can interact with the Mixin this object', function() {
      var Child = Cip[extend](function() {
        this.a += 1;
      });

      var ChildToMixin = Cip[extend](function() {
        this.a = 1;
      });

      Child.mixin(ChildToMixin);
      var child = new Child();
      assert.equal(child.a, 2);
    });


    test('Mixin prototype methods get passed down the chain', function() {
      var Child = Cip[extend](function() {
        this.a = 1;
      });

      var ChildToMixin = Cip[extend]();
      ChildToMixin.prototype.add = function(a, b) {
        return a + b;
      };

      Child.mixin(ChildToMixin);

      var GrandChild = Child[extend](function() {
        this.c = 3;
      });

      var grandChild = new GrandChild();

      assert.isFunction(grandChild.add);
      assert.equal(grandChild.add(1, 1), 2);
    });
  });
}

suite('Mixins Typical Inheritance', function() {
  registerTests('extend', false);
});
suite('Mixins Singleton Inheritance', function() {
  registerTests('extendSingleton', false);
});

suite('Mixins edge cases', function() {
  suite('Ctor Properties used by mixins', function() {
    var middlewarify = require('middlewarify');
    setup(function() {
      this.Mixin = Cip.extend();
      this.Mixin.prototype.run = function() {
        return this.prop;
      };

      this.Base = Cip.extend(function() {
        this.prop = {
          a: 1,
        };

        middlewarify.make(this, 'ron', this.run.bind(this));
      });
      this.Base.mixin(this.Mixin);

      this.BaseExtend = this.Base.extend(function() {
        this.prop.b = 2;
      });
    });

    test('Prop should be correctly propagated', function(done) {
      var baseExtend = new this.BaseExtend();
      baseExtend.ron().then(function(prop) {
        assert.equal(prop.b, 2);
        done();
      });
    });
  });
});
