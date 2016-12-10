# About #

tail-stream has one function: ts.createReadStream which is like fs.createReadStream, but does not stop reading the file when end of file is reached. Instead, it watches the file using fs.watch if available or fs.watchFile otherwise, and streams data as the file grows. 

# Options #

* beginAt: Where to begin reading. This can be an offset in number of bytes or 'end' (default: 0).
* detectTruncate: Perform truncate detection (default: true)
* onTruncate: What to do when truncate is detected. Set to 'end' to end the stream, or 'reset' to seek to the beginning of the file and resume reading (default: 'end').
* onMove: What to do when the file is moved/renamed. Can be 'error' to give an error, 'end' to end the stream, 'follow' to continue streaming the file, or 'stay' to wait for another file to appear at the file's old path and resume streaming from the new file when it appears (default: 'follow').
* endOnError: If set to true, the stream will end if an error occurs (default: false).
* useWatch: If true, fs.watch will be used if available, otherwise fs.watchFile will be used. If false, fs.watchFile will always be used (default: true).

# Events #

## error ##

If opts.endOnError is set, then error events are never emitted. Only end events.

## eof ##

eof events are emitted whenever the end of file is encountered. eof events can be emitted multiple times if someone is writing to the file slower than it is being read.

## end ##

The 'end' event is only emitted if an error is encountered and opts.endOnError is true, or if the file is truncated and opts.onTruncate is set to 'end'.

## move ##

move events are emitted if opts.onMove is set to either 'follow' or 'stay'. If the operating system has support for it, the event callback receives two arguments the old, pre-move absolute path of the file and the new, post-move absolute path of the file. For more information on operating system support, see the FAQ below.

## truncate ##

truncate events are emitted whenever the filesize is changed to less than the previous file size. It sends along the new size and previous size as arguments.

truncate events are emitted unless opts.detectTruncate is set to false.

## replace ##

If opts.onMove is set to 'stay' and the original file was moved then the new 'replace' event is emitted when a new file appears at the old path of the original file.

# Example #

More examples available in the examples directory.

```
var ts = require('tail-stream');

var tstream = ts.createReadStream('foo', {
    beginAt: 0,
    onMove: 'follow',
    detectTruncate: true,
    onTruncate: 'end',
    endOnError: false
});

tstream.on('data', function(data) {
    console.log("got data: " + data);
});

tstream.on('eof', function() {
    console.log("reached end of file");
});

tstream.on('move', function(oldpath, newpath) {
    console.log("file moved from: " + oldpath + " to " + newpath);
});

tstream.on('truncate', function(newsize, oldsize) {
    console.log("file truncated from: " + oldsize + " to " + newsize);
});

tstream.on('end', function() {
    console.log("ended");
});

tstream.on('error', function(err) {
    console.log("error: " + err); 
});
```

# FAQ #

## How do I use this to follow a rotating log? ##

You need to set the onMove option to 'stay'. Look at examples/log_rotate.js to see how it's done.

## What happens if the file is deleted? ##

If endOnError is set, then the stream ends. If endOnError is not set, then an error event is emittted stating that the file was deleted.

## What happens if the file is changed but the length stays the same? ##

An 'eof' event is emitted. No other events are emitted.

## What happens if the file is moved/renamed? ##

### If onMove is 'follow' ###

If the operating system has the /proc/self/fd folder (only modern Linux I believe) then everything will work as expected.

If the operating system does not have the /proc/self/fd folder, but fs.watch is available, then the 'move' event callback will receive null instead of the new file path, and subsequent move events will receive null instead of both the old and new file paths. Also, if truncate detection is enabled it will stop functioning after move, meaning that subsequent truncates will only result in an eof event.

If the operating system does not have the /proc/self/fd folder, and fs.watch is _not_ available, then the move/rename is detected as a file deletion, resulting in an error event stating that the file was deleted.

### If onMove is 'error' or 'end' ###

If the operating system has the /proc/self/fd folder _or_ fs.watch is available, then everything works as expected.

If the operating system does not have the /proc/self/fd folder, _and_ fs.watch is _not_ available, then the move/rename is detected as a file deletion, resulting in an error event stating that the file was deleted.

### If onMove is 'stay' ###

This always works as expected, but fs.watchFile is used when waiting for a replacement file to appear. Since fs.watchFile relies on stat polling, there can be a delay between when the replacement file appears and when it is reported. fs.watch is still used when not waiting for a replacement file to appear.

# ToDo #

* Implement unit tests.
* Test on other operating systems.

# License #

License is [GPLv3](http://www.gnu.org/licenses/gpl-3.0.html).

# Appreciation #

If you appreciate this library, then you can [tip me with recurring micro-donations on GitTip](https://www.gittip.com/juul/), or [tip me with one-off donations on Flattr](https://flattr.com/profile/juul). This helps me spend all of my time making useful free and open source things :)
