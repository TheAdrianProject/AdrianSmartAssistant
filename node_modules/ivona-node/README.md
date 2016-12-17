# Node IVONA 

Node client library for [IVONA Speech Cloud API](http://www.ivona.com/us/). Yes, this is up-to-date and uses the most recent AWS Signature 4 scheme (thanks to [aws4](https://github.com/mhart/aws4)). All you need is your Ivona access and secret (the one only given to you once upon creating it) keys.

## Supported API Calls

- CreateSpeech
- ListVoices
- PutLexicon
- GetLexicon
- DeleteLexicon
- ListLexicons

## Installation

```
npm install ivona-node
```

## Documentation

No current documentation, as the entire extent of the API can be viewed below.

## Example usage

```javascript
    var ivona = new Ivona({
        accessKey: 'IVONA_ACCESS_KEY',
        secretKey: 'IVONA_SECRET_KEY'
    });

    ivona.listVoices()
        .on('complete', function(voices) {
            console.log(voices);
        });

    //  ivona.createVoice(text, config)
    //  [string] text - the text to be spoken
    //  [object] config (optional) - override Ivona request via 'body' value
    ivona.createVoice('This is the text that will be spoken.', {
        body: {
            voice: {
                name: 'Salli',
                language: 'en-US',
                gender: 'Female'
            }
        }
    }).pipe(fs.createWriteStream('text.mp3'));
```

## Lexicons (via @UnaliWear)

```javascript
    var ivona = new Ivona({
        accessKey: 'IVONA_ACCESS_KEY',
        secretKey: 'IVONA_SECRET_KEY'
    });

    //  ivona.putLexicon(name, content)
    //  [string] name - the name of this lexicon
    //  [string] content - PLS xml
    //  [object] config (optional) - override Ivona request via 'body' value
    ivona.putLexicon('newLexicon', '<?xml ... ?><lexicon>...</lexicon>')
        .on('complete', function(lexicons) {
            console.log(lexicons);
        });

    //  ivona.getLexicon(name)
    //  [string] name - the name of this lexicon
    //  [object] config (optional) - override Ivona request via 'body' value
    ivona.getLexicon('newLexicon')
        .on('complete', function(pls) {
            console.log(pls);
        });

    //  ivona.deleteLexicon(name)
    //  [string] name - the name of this lexicon
    //  [object] config (optional) - override Ivona request via 'body' value
    ivona.deleteLexicon('newLexicon')
        .on('complete', function() {
            console.log('Done');
        });

    //  ivona.listLexicons()
    //  [object] config (optional) - override Ivona request via 'body' value
    ivona.listLexicons()
        .on('complete', function(lexicons) {
            console.log(lexicons);
        });

```

## With Proxy Support (via @kuzzmi)

```javascript
    var ivona = new Ivona({
        accessKey: 'IVONA_ACCESS_KEY',
        secretKey: 'IVONA_SECRET_KEY',
        proxy: {
            host: '0.0.0.0',
            port: 12345
        }
    });
```

## Contributors
- @kuzzmi
- @UnaliWear
