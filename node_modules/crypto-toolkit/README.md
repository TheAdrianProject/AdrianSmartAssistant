Crypto-Toolkit
==============

A set of utility functions/wrapper to simplify the development workflow

```bash
$ npm install crypto-toolkit
```

Features
--------

* Hash Function Wrapper (MD5, SHA1, SHA244, SHA256, SHA384, SHA512, WHIRLPOOL)
* Create Object/Array Hashes based on its JSON representation


Hash Function Wrapper
---------------------

Provides easy access to the [Node.js Crypto Hash](https://nodejs.org/api/crypto.html#crypto_class_hash) functions. Examples are available in [examples/hash.js](examples/hashes.js)

```js
// default hex encoding
var _hash = require('crypto-toolkit').Hash('hex');

console.log(_hash.sha256('Hello World'));
```

##### Initialization #####

```js
require('crypto-toolkit').Hash([encoding:string])
```

The argument `encoding` is optional and defines the output encoding of the digest.

 * **hex** (default) - hexadecimal string output
 * **base64** - base64 string output
 * **binary** - binary output as [Buffer](https://nodejs.org/api/buffer.html)


##### Hash Algorithms #####

The following wrappers are included:

 * `md5(input:mixed, [encoding:string])`
 * `sha1(input:mixed, [encoding:string])`
 * `sha2(input:mixed, [encoding:string])`
 * `sha224(input:mixed, [encoding:string])`
 * `sha256(input:mixed, [encoding:string])`
 * `sha384(input:mixed, [encoding:string])`
 * `sha512(input:mixed, [encoding:string])`
 * `whirlpool(input:mixed, [encoding:string])` 
 
### General Usage ###

```js
var _hash = require('crypto-toolkit').Hash('hex');

// some input
var input = 'Hello World';

// display some hashes
console.log('Default HEX Output');
console.log(' |- MD5      ', _hash.md5(input));
console.log(' |- SHA1     ', _hash.sha1(input));
console.log(' |- SHA256   ', _hash.sha256(input));
console.log(' |- SHA384   ', _hash.sha384(input));
console.log(' |- SHA512   ', _hash.sha512(input));
console.log(' |- WHIRLPOOL', _hash.whirlpool(input));

// override the default output type
console.log('Override the default output settings');
console.log(' |- HEX      ', _hash.sha1(input, 'hex'));
console.log(' |- BIN      ', _hash.sha1(input, 'binary'));
console.log(' |- BASE64   ', _hash.sha1(input, 'base64'));
console.log('');
```

### Objects ###

Objects/Arrays are automatically serialized as JSON String. The JSON object is then passed into the hash function.

```js
var _hash = require('crypto-toolkit').Hash('hex');

// demo object
var objectInput = {
    x: 1,
    b: 2,
    c: [5,6,7],
    d: {
        y: 'Hello',
        z: 'World'
    }
};

console.log('Object Input');
console.log(' |- SHA256   ', _hash.sha256(objectInput));
console.log('');
```

Any Questions ? Report a Bug ? Enhancements ?
---------------------------------------------
Please open a new issue on [GitHub](https://github.com/AndiDittrich/Node.Crypto-Toolkit/issues)

License
-------
Crypto-Toolkit is OpenSource and licensed under the Terms of [The MIT License (X11)](http://opensource.org/licenses/MIT). You're welcome to contribute!