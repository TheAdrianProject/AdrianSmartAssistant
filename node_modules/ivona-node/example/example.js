var fs = require('fs'),
    Ivona = require('../src/main');

var ivona = new Ivona({
    accessKey: 'IVONA_ACCESS_KEY',
    secretKey: 'IVONA_SECRET_KEY'
});

ivona.listVoices().on('complete', function(voices) {
    console.log(voices);
});

//  [string] text - the text to be spoken
//  [object] config (optional) - override Ivona request via 'body' value
ivona.createVoice('This is the text that will be spoken.')
    .pipe(fs.createWriteStream('example/test.mp3'));
