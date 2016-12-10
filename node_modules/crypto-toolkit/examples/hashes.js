// simple hashes
var _hash = require('../lib/Hash')();
var _b64hash = require('../lib/Hash')('base64');

var input = 'Hello World';

// display some hashes
console.log('Default HEX Output');
console.log(' |- MD5      ', _hash.md5(input));
console.log(' |- SHA1     ', _hash.sha1(input));
console.log(' |- SHA224   ', _hash.sha224(input));
console.log(' |- SHA256   ', _hash.sha256(input));
console.log(' |- SHA384   ', _hash.sha384(input));
console.log(' |- SHA512   ', _hash.sha512(input));
console.log(' |- WHIRLPOOL', _hash.whirlpool(input));
console.log('');

// display some base64 hashes
console.log('Set BASE64 Output');
console.log(' |- MD5      ', _b64hash.md5(input));
console.log(' |- SHA1     ', _b64hash.sha1(input));
console.log(' |- SHA256   ', _b64hash.sha256(input));
console.log(' |- SHA384   ', _b64hash.sha384(input));
console.log(' |- SHA512   ', _b64hash.sha512(input));
console.log(' |- WHIRLPOOL', _b64hash.whirlpool(input));
console.log('');

// display some hashes
console.log('Override the default output settings');
console.log(' |- HEX      ', _b64hash.sha1(input, 'hex'));
console.log(' |- BIN      ', _b64hash.sha1(input, 'binary'));
console.log(' |- BASE64   ', _b64hash.sha1(input, 'base64'));
console.log('');

// hash objects
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