'use strict';

var fs      = require('fs'),
    http    = require('http'),
    https   = require('https'),
    aws4    = require('aws4'),
    Stream  = require('stream'),
    HttpsPA = require(__dirname + '/proxy');

/**
 * Default options used for request body.
 * These *can* be overriden. The properties are all lower-case on purpose,
 * they are uppercased when a request is made.
 */
var voiceSettings = {
    input: {
        data           : null,
        type           : 'text/plain'
    },
    outputFormat: {
        codec          : 'MP3',
        sampleRate     : 22050
    },
    Parameters: {
        rate           : 'medium',
        volume         : 'medium',
        sentenceBreak  : 500,
        paragraphBreak : 650
    },
    voice: {
        name           : 'Salli',
        language       : 'en-US',
        gender         : 'Female'
    }
};

var voiceListSettings = {};

var putLexiconSettings = {
    lexicon: {}
};

var getLexiconSettings = {};

var deleteLexiconSettings = {};

var listLexiconSettings = {};

/**
 * Grab values of property `prop` from object `source`
 * @param  {Object} source - The object with property `prop`
 * @param  {String} prop   - The name of the property whose value is saught
 * @return {Mixed}         - Value of property `prop` from object `source`
 */
function pluck(source, prop) {
    var output = {},
        i;
    var props = Array.prototype.slice.call(arguments, 1);

    for (i in source)
        if (props.indexOf(i) >= 0) output[i] = source[i];

    return output;
}

/**
 * Merge two objects, the first being the "source" with least value priority
 * (the `reference` will always overwrite).
 *
 * @param  {Object} source    The seed object
 * @param  {Object} reference The object whose prop/val will be written to `source`
 * @param  {Boolean} deep     Recursively merge objects?
 * @return {Object}           A copy of the seed merged with the reference
 */
function merge(source, reference, deep) {
    var output = {},
        i;

    for (i in source) output[i] = source[i];

    for (i in reference) {
        if (typeof reference[i] === 'object' && deep === true) {
            output[i] = merge(output[i], reference[i], deep);
        } else {
            output[i] = reference[i];
        }
    }

    return output;
}

/**
 * Capitalize all property names within an object, with the option to do so recursively.
 * @param  {Object} source The seed object
 * @param  {Boolean} deep  Recursively capitalize properties
 * @return {Object}        A copy of the seed with capitalized property names
 */
function caseProperties(source, deep, lower) {
    var output = {},
        i;
    var method = lower ? 'toLowerCase' : 'toUpperCase';

    for (i in source) {
        if (typeof source[i] !== 'object' || Array.isArray(source[i])) {
            output[i.charAt(0)[method]() + i.substr(1)] = source[i];
        } else {
            output[i.charAt(0)[method]() + i.substr(1)] = caseProperties(source[i], deep, lower);
        }
    }

    return output;
}

/**
 * An Ivona Cloud API request
 * @param {Object} request - a signed request returned from `aws4`
 */
function IvonaRequest(request, ivona) {
    if (request.buffer) this.buffer = true;

    var keys = {
        accessKeyId     : ivona.accessKey,
        secretAccessKey : ivona.secretKey
    };

    this.signedCredentials = aws4.sign(request, keys);

    this.proxy = ivona.proxy;
}

IvonaRequest.prototype = {
    //  the last given credentials
    signedCredentials: null,
    //  the last active request
    stream: null,

    /**
     * execute the request
     * @return {ReadableStream} the streamed audio response from Ivona
     */
    exec: function() {
        var req;
        var buffer = this.buffer;
        var data = '';

        var requestParams = this.signedCredentials;

        if (this.proxy !== undefined) {
            var agent = new HttpsPA({
                proxyHost : this.proxy.host,
                proxyPort : this.proxy.port
            });

            requestParams.agent = agent;
        }

        req = https.request(requestParams, function(res) {

            res.on('data', function(chunk) {
                if (buffer) data += chunk;
                req.emit('data', chunk);
            });

            res.on('end', function() {
                if (buffer) {
                    if (/json/i.test(res.headers['content-type']) && data.length > 0) {
                        req.emit('complete', caseProperties(JSON.parse(data), true, true));
                    } else {
                        req.emit('complete', data);
                    }
                }
                data = null;
                req.emit('end');
            });

            res.on('error', function(err) {
                throw new Error(err);
            });

        });

        if (this.signedCredentials.body) req.write(this.signedCredentials.body);
        req.end();

        return (this.stream = req);
    }
};

/**
 * The Ivona API interface.
 * @param {Object} config - configuration for Ivona Cloud account
 */
function Ivona(config) {
    //  THESE ARE NOT REQUIRED (and for the foreseeable future shouldn't be overridden)
    this.host    = config.host    || 'tts.eu-west-1.ivonacloud.com';
    this.service = config.service || 'tts';
    this.method  = config.method  || 'POST';
    this.region  = config.region  || 'eu-west-1';

    // THAT IS OPTIONAL (if proxy should be defined)
    this.proxy   = config.proxy   || undefined;

    //  THESE ARE REQUIRED
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
}

Ivona.prototype = {
    request: null,
    voices: null,

    /**
     * Creates a default request config (used by `Ivona`)
     * @param  {String} path   The path to the service being used
     * @param  {Object} config (optional) configuration for request
     * @return {Object}        The default request options
     */
    getRequest: function(path, config) {
        return {
            path    : path,
            host    : config.host    || this.host,
            buffer  : config.buffer  || false,
            service : config.service || this.service,
            method  : config.method  || this.method,
            region  : config.region  || this.region,
            proxy   : config.proxy   || this.proxy,
            headers: {
                'content-type': 'application/json'
            },
            body: config.body || ''
        };
    },

    /**
     * Interface to the Ivona Cloud `createVoice` endpoint
     * @param  {String} text    The text to be spoken
     * @param  {Object} config  Configuration overrides
     * @return {IvonaRequest}   The `https.request` returned from an `IvonaRequest`
     */
    createVoice: function(text, config) {
        if (!config) config = {};

        if (config.body) {
            config.body = merge(Object.create(voiceSettings), config.body);
        } else {
            config.body = Object.create(voiceSettings);
        }

        config.body.input.data = text;
        //  must be string for aws4
        config.body = JSON.stringify(caseProperties(config.body, true));

        this.request = new IvonaRequest(
            this.getRequest('/CreateSpeech', config),
            this
        );

        return this.request.exec();
    },

    /**
     * Interface to the Ivona Cloud `ListVoices` endpoint
     * @param  {Object} config  Configuration overrides
     * @return {IvonaRequest}   The `https.request` returned from an `IvonaRequest`
     */
    listVoices: function(config) {
        if (!config) config = {};

        if (config.body) {
            config.body = merge(Object.create(voiceListSettings), config.body);
        } else {
            config.body = Object.create(voiceListSettings);
        }
        //  must be string for aws4
        config.body = JSON.stringify(caseProperties(config, true));
        config.buffer = true;

        this.request = new IvonaRequest(
            this.getRequest('/ListVoices', config || {}),
            this
        );

        return this.request.exec();
    },

    /**
     * Interface to the Ivona Cloud `PutLexicon` endpoint
     * @param  {String} name      Name of this lexicon
     * @param  {String} contents  PLS contents
     * @param  {Object} config    Configuration overrides
     * @return {IvonaRequest}     The `https.request` returned from an `IvonaRequest`
     */
    putLexicon: function(name, contents, config) {
        if (!config) config = {};

        if (config.body) {
            config.body = merge(Object.create(putLexiconSettings), config.body);
        } else {
            config.body = Object.create(putLexiconSettings);
        }

        config.body.lexicon.name = name;
        config.body.lexicon.contents = contents;

        //  must be string for aws4
        config.body = JSON.stringify(caseProperties(config.body, true));

        this.request = new IvonaRequest(
          this.getRequest('/PutLexicon', config),
          this
        );

        return this.request.exec();
    },


    /**
     * Interface to the Ivona Cloud `GetLexicons` endpoint
     * @param  {Object} name      Name of lexicon to retrieve
     * @param  {Object} config    Configuration overrides
     * @return {IvonaRequest}     The `https.request` returned from an `IvonaRequest`
     */
    getLexicon: function(name, config) {
        if (!config) config = {};

        if (config.body) {
            config.body = merge(Object.create(getLexiconSettings), config.body);
        } else {
            config.body = Object.create(getLexiconSettings);
        }

        config.body.name = name;
        //  must be string for aws4
        config.body = JSON.stringify(caseProperties(config.body, true));
        config.buffer = true;

        this.request = new IvonaRequest(
          this.getRequest('/GetLexicon', config || {}),
          this
        );

        return this.request.exec();
    },

    /**
     * Interface to the Ivona Cloud `DeleteLexicon` endpoint
     * @param  {Object} name      Name of lexicon to retrieve
     * @param  {Object} config    Configuration overrides
     * @return {IvonaRequest}     The `https.request` returned from an `IvonaRequest`
     */
    deleteLexicon: function(name, config) {
        if (!config) config = {};

        if (config.body) {
            config.body = merge(Object.create(deleteLexiconSettings), config.body);
        } else {
            config.body = Object.create(deleteLexiconSettings);
        }

        config.body.name = name;
        //  must be string for aws4
        config.body = JSON.stringify(caseProperties(config.body, true));
        config.buffer = true;

        this.request = new IvonaRequest(
          this.getRequest('/DeleteLexicon', config || {}),
          this
        );

        return this.request.exec();
    },

    /**
     * Interface to the Ivona Cloud `ListLexicons` endpoint
     * @param  {Object} config    Configuration overrides
     * @return {IvonaRequest}     The `https.request` returned from an `IvonaRequest`
     */
    listLexicons: function(config) {
        if (!config) config = {};

        if (config.body) {
            config.body = merge(Object.create(listLexiconSettings), config.body);
        } else {
            config.body = Object.create(listLexiconSettings);
        }

        //  must be string for aws4
        config.body = JSON.stringify(caseProperties(config, true));
        config.buffer = true;

        this.request = new IvonaRequest(
          this.getRequest('/ListLexicons', config || {}),
          this
        );

        return this.request.exec();
    }
};

module.exports = Ivona;