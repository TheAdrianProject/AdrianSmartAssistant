# CIP

> Classical Inheritance Pattern at its best!

Provides `.extend()` convenience function with argument stubbing, always retaining the prototypal inheritance chain making `instanceof` work.

[![Build Status](https://travis-ci.org/thanpolas/cip.png?branch=master)](https://travis-ci.org/thanpolas/cip)

## Installation

```shell
npm install cip --save
```


## Quick Start

```javascript
var cip = require('cip');

// Create a child from the base Constructor.
var Child = cip.extend();

Child.prototype.add = function(a, b) {
  return a + b;
};

// Create a grand child from the child using a Constructor.
var GrandChild = Child.extend(function(a, b){
  this.a = a;
  this.b = b;
});

GrandChild.prototype.getAddition = function() {
  return this.add(this.a, this.b);
};

// instantiate a GrandChild
var grandChild = new GrandChild(4, 5);

console.log(grandChild.getAddition());
// prints: 9
```

## API

### extend() Create a new Constructor

> cip.extend(...args=, Constructor=)

* **...args=** `Any Type` *Optional* :: Any number of any type of arguments to use for stubbing the Parent Constructor. This is an advanced topic, more on that at [Stubbed Arguments](#argument-stubbing-with-extend).
* **Constructor=** `Function` *Optional* :: Optionally pass a Constructor.
* Returns `Function` A new Constructor.

Extend will create a new Constructor that inherits from the Ctor it was called from. Optionally you can define your own Constructor that will get invoked as expected on every new instantiation.

Extend uses the Classical pattern for inheritance optimized by flat prototype cloning using `Object.create()`.

[Check out the tests relating to `extend()` and inheritance.][test.inheritance]

### extendSingleton() Create a new Singleton Constructor

> cip.extendSingleton(...args=, Constructor=)

* **...args=** `Any Type` *Optional* :: Any number of any type of arguments to use for stubbing the Parent Constructor. This is an advanced topic, more on that at [Stubbed Arguments](#argument-stubbing-with-extend).
* **Constructor=** `Function` *Optional* :: Optionally pass a Constructor.
* Returns `Function` A new Constructor.

The `extendSingleton()` has the same behavior as `extend()` with the exception that it follows the Singleton Pattern. The extended Constructor will have an additional static method named `getInstance()` which will always return the same instance.

A Constructor extended with `extendSingleton()` will always return the same instance even if instantiated with the `new` keyword.

```js
var Ctor = cip.extendSingleton(function() {
  this.a = 1;
});

var instance = Ctor.getInstance();
instance.a++;

var sameInstance = new Ctor();
sameInstance === instance; // true
sameInstance.a === instance.a; // true
```

[Check out the tests relating to `extend()` and inheritance.][test.inheritanceSingleton]


### Custom Constructor and Arguments

Using your own constructor when invoking `extend()` is a good practise for properly initializing your instances. Your constructor may accept any number of arguments as passed on instantiation. All Parent constructors will receive the same exact arguments, unless you use Argument Stubbing...

### Argument Stubbing with extend()

Argument Stubbing is providing arguments to the `extend()` function with the intend of passing them to the Parent constructor. Consider this case:

##### base.model.js

```js
var Model = cip.extend(function(name) {
  this._modelName = name;
});

Model.prototype.getName = function() {
  return this._modelName;
};
```

##### user.model.js

```js
var Model = require('./base.model');

// "user" is a stubbed argument, it will be passed to the
// Model Constructor as the first argument.
var UserModel = Model.extend('user', function(firstName, lastName){
  this.firstName = firstName;
  this.lastName = lastName;
});

var user = new UserModel('John', 'Doe');
console.log(user.getName());
// prints "user"
```
Argument Stubbing can be infinitely nested and inherited, Cip keeps track of each Constructor's Stubbed Arguments and applies them no matter how long the inheritance chain is.

> **Beware** While Cip does a good job at not confusing passed functions as your Constructor, the last argument of the `extend()` method if it's of type `function` is will always be used as the new constructor.

```js
// can stub arguments without a constructor
var GrandChild = Child.extend(1, 2, 3);

// If last argument is a function it will be the Constructor
var GreatGrandChild = GrandChild.extend(4, 5, 6, function(){/* ctor */});
```

[Check out the tests relating to argument stubbing.][test.stubbed]

#### Constructor Arity is important

Cip uses your constructor's arity to determine the exact amount of arguments to pass. This means that the constructor will get as many arguments as are defined, as long as they are available by the instantiation.

[addy.proto]: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#constructorpatternjavascript
[util.inherits]: http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor
[test.stubbed]: https://github.com/thanpolas/inher/blob/master/test/arguments.test.js

#### Static Methods and Properties

Static methods and properties are defined on the Constructor directly vs using the `prototype`. Static functions and properties do not get inherited by subsequent children. A good use for static properties is to define consts or enums that relate to your module.

```js
var UserModel = Model.extend(function(userType) {
  /** @type {UserModel.Type} Store the user type in the instance */
  this._userType = userType;
});

/** @enum {string} The types of users */
UserModel.Type = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
};

// ...

var moderator = new UserModel(UserModel.Type.MODERATOR);
```

#### Instantiation

The inheritance pattern Cip uses dictates that all instances are created using the `new` keyword. The obvious exception being Constructors created using `extendSingleton()`.

```js

var Thing = cip.extend();

var thing = new Thing();
```

[test.inheritance]: https://github.com/thanpolas/cip/blob/master/test/inheritance.test.js
[test.inheritanceSingleton]: https://github.com/thanpolas/cip/blob/master/test/singleton-inheritance.test.js

### mixin() Mixin the prototype of a Constructor

> Ctor.mixin(...Constructor)

* **Constructor** `...Function` :: Any number of Constructors passed as separate arguments.
* Returns `void` Nothing.

The `mixin()` method will merge the prototype of the mixed in Ctors and ensure their constructors are invoked. The full inheritance chain of a Mixin is honored along with their respective Stubbed Arguments, if any. The Mixin's constructor will be invoked in the same context and therefore you can easily interact with internal properties and methods.

```js
var Human = cip.extend(function() {
  this.firstName = null;
  this.lastName = null;
});

var Woman = cip.extend(function() {
  this.favoriteColor = null;
});

var Man = cip.extend(function() {
  this.favoriteChannel = null;
});

var Developer = cip.extend(function() {
  this.programmingLanguages = [];
  this.email = null;
});

var Designer = cip.extend(function() {
  this.colors = [];
  this.email = null;
});
// ...

var Unicorn = Human.extend();
Unicorn.mixin(Woman, Man, Developer, Designer);

// now that isn't quite a Unicorn, but you get the picture...
Array.isArray(Unicorn.colors); // true
Array.isArray(Unicorn.programmingLanguages); // true
null === Unicorn.favoriteChannel; // true
```

#### Order of Invocation

Mixin constructors will be invoked before the Constructor that mixed them in, so for the following case:

```js
var Core = cip.extend();

var MixinOne = Core.extend();
var MixinTwo = cip.extend();
var MixinThree = cip.extend();
var MixinFour = cip.extend();


var Child = cip.extend();
Child.mixin(MixinOne);

var GrandChild = Child.extend();
GrandChild.mixin(MixinTwo, MixinThree);

var GreatGrandChild = GrandChild.extend();
GreatGrandChild.mixin(MixinFour);
```

When `GreatGrandChild` will be instantiated this will be the sequence of Constructor invocations:

1. Core()
2. MixinOne()
3. Child()
4. MixinTwo()
5. MixinThree()
6. GrandChild()
7. MixinFour()
8. GreatGrandChild()

[Check out the Mixins tests](https://github.com/thanpolas/cip/blob/master/test/mixins.test.js)

### getInstance() Get a singleton instance

> Ctor.getInstance()

* Returns `Object` An instance of Ctor.

Use the `getInstance()` for getting a singleton of the Constructor. This static function is only available to Constructors that where created using `extendSingleton()`.

```js
var UserController = Controller.extendSingleton(function(app) {
  this.app = app;
});

// Get the singleton
UserController.getInstance();
```

```js
// ... someplace else far far away ...

// This will return the same exact instance
var UserController = require('../../controllers/user.ctrl');
var userController = UserController.getInstance();
```

### cast() Clone and cast a Vanilla Constructor

> cip.cast(VanillaCtor)

* **VanillaCtor** `Function` :: A vanilla constructor.
* Returns `Function` :: A clone copy of the VanillaCtor augmented with Cip's static properties and functions.

The `cast()` method is only available from the Cip module, it will add all the static methods that every Cip ctor has.

```js
// Use EventEmitter as the base Constructor.
var EventEmitter = require('events').EventEmitter;

var cip = require('cip');

var CeventEmitter = cip.cast(EventEmitter);

var Thing = CeventEmitter.extend();

var newThing = new Thing();

newThing instanceof CeventEmitter; // true
newThing instanceof EventEmitter; // true
```

[Check out the `wrap()` tests](https://github.com/thanpolas/cip/blob/master/test/cast.test.js)

### is() Determines if a Constructor is a product of Cip

> cip.is(Ctor)

* **Ctor** `Function` :: A constructor.
* Returns `boolean`

The `is()` method is only available from the Cip module, it determines if a constructor has cip properties.

```js
var cip = require('cip');

var Thing = cip.extend();

cip.is(Thing); // true
```

## Release History

- **v1.0.0**, *09 Dec 2014*
    - Honorary jump, the CIP API is stable and battle tested for over a year.
    - Cip children will now properly report their name on exception cases.
- **v0.2.5**, *06 Jul 2014*
    - Now supports returning custom objects from constructors.
- **v0.2.4**, *14 Mar 2014*
    - Fix singleton extending singleton bug.
    - Updated all required packages to latest.
- **v0.2.1**, *17 Feb 2014*
    - fix not passing `extendSingleton()` reference properly bug.
- **v0.2.0**, *17 Feb 2014*
    - Introduced `extendSingleton()` to explicitly state a Ctor follows the Singleton pattern.
    - Renamed package to "cip"
    - Renamed `isInher()` method to `is()`
    - Renamed `wrap()` to `cast()`
    - Optimizations in all inheritance mechanisms.
    - Changed argument type signature for `mixin()`, now only accepts multiple Ctors.
- **v0.1.0**, *7 Feb 2014*
    - `wrap()` Now does not mutate the Ctor passed.
    - `getInstance()` will not accept arguments, it's an anti-pattern.
- **v0.0.3**, *7 Feb 2014*
    - Clear dependencies
- **v0.0.2**, *7 Feb 2014*
    - Bug Fixes
- **v0.0.1**, *7 Feb 2014*
    - Big Bang

## License
Copyright (c) 2014 Thanasis Polychronakis. Licensed under the MIT license.
