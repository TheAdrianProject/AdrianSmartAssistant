#!/usr/bin/env node

var ts = require('../index.js');

var tstream = ts.createReadStream('foo', {
    beginAt: 0,
    detectTruncate: true,
    onTruncate: 'end', // or 'reset' to seek to beginning of file
    endOnError: false
});

tstream.on('data', function(data) {
    console.log("Got data: " + data);
});

tstream.on('eof', function() {
    console.log('Reached end of file. In a different terminal try: echo "wizards rule" >> foo');
});

tstream.on('truncate', function(newsize, oldsize) {
    console.log("File truncated from: " + oldsize + " to " + newsize + " bytes");
});

tstream.on('end', function() {
    console.log("Ended");
});

tstream.on('error', function(err) {
    console.log("Error: " + err); 
});