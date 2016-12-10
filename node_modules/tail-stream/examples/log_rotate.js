#!/usr/bin/env node

var ts = require('../index.js');

var tstream = ts.createReadStream('foo', {
    beginAt: 0,
    onMove: 'stay',
    detectTruncate: true,
    onTruncate: 'reset',
    endOnError: false
});

tstream.on('data', function(data) {
    console.log("Got data: " + data);
});

var ended = false;

tstream.on('eof', function() {
    console.log('Reached end of file');
    if(!ended) {
        console.log("In a different terminal, try: mv foo /tmp/bar");
        ended = true;
    }
});

tstream.on('move', function(oldpath, newpath) {
    if(oldpath && newpath) {
        console.log("File moved from " + oldpath + " to " + newpath);
    } else if(oldpath) {
        console.log("File moved from " + oldpath + " to an unknown location");
    } else {
        console.log("File moved");
    }
    console.log('In a different terminal, try: echo "lizard school" > foo');
    console.log("(you may have to wait a few seconds)");
});

tstream.on('truncate', function(newsize, oldsize) {
    console.log("File truncated from: " + oldsize + " to " + newsize + " bytes");
});

tstream.on('replace', function() {
    console.log("A new file appeared at the file's old path. You are now streaming the new file");
});

tstream.on('end', function() {
    console.log("Ended");
});

tstream.on('error', function(err) {
    console.log("Error: " + err); 
});