
var sleepTime = require('./index');


console.log("test: 2 ms test");

var t1 = new Date();
sleepTime(2000);
var t2 = new Date();
console.log("sleeped time => " + (t2.getSeconds() - t1.getSeconds()));


