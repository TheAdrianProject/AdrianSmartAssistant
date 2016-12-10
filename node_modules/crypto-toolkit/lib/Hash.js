var _crypto = require('crypto');

// generic string hashing
function hash(input, algo, type){
    // string input ?
    if (typeof input !== 'string'){
        input = JSON.stringify(input);
    }

    // create hash algo
    var sum = _crypto.createHash(algo);

    // set content
    sum.update(input);

    // binary output ?
    if (type && type.toLowerCase().trim() == 'binary'){
        // calculate hashsum
        return sum.digest();

    // string output
    }else{
        // calculate hashsum
        return sum.digest(type);
    }
}

// generator
function _frontend(hashtype, defaultOutputType){
    return function(input, outputType){
        return hash(input, hashtype, outputType || defaultOutputType);
    }
}

// export all function
module.exports = function(outputType){
    // default value
    outputType = outputType || 'hex';

    // create the user frontend functions
    return {
        md5:    _frontend('md5', outputType),
        sha1:   _frontend('sha1', outputType),
        sha2:   _frontend('sha256', outputType),
        sha224: _frontend('sha224', outputType),
        sha256: _frontend('sha256', outputType),
        sha384: _frontend('sha384', outputType),
        sha512: _frontend('sha512', outputType),
        whirlpool: _frontend('whirlpool', outputType)
    }
};
