var ws281x = require('./node_modules/rpi-ws281x-native/index.js');
//var keypress = require('keypress') , tty = require('tty');
var sleep = require('sleep');
var http = require('http');
var url = require("url");
var chalk = require('chalk');

var NUM_LEDS = 23;
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);


var BrightnessVolume = 30;
var speed = 80;
var PORT = 9150;


//We need a function which handles requests and send response
function handleRequest(request, response){

    var method = url.parse(request.url).query;

    if (method=="ready"){

       setReady()

    }

    if ( method=="active"){

        setActice()

    }

    //console.log(chalk.blue("Neopixel Got Request : "+ method)); 
  

    response.end('{"service":"running"}');

}

//Create a server
var server = http.createServer(handleRequest);
//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log(chalk.green("NEOPIXEL DEAMON : Port listening on : http://localhost:", PORT));
});


// ---- trap the SIGINT and reset before exit

process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});


// make `process.stdin` begin emitting "keypress" events

/*
keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
   
    if (key.name == 'escape'){
         ws281x.setBrightness(0);
        process.exit(1);
       
    }
});

if (typeof process.stdin.setRawMode == 'function') {
  process.stdin.setRawMode(true);
} else {
  tty.setRawMode(true);
}
process.stdin.resume();

*/


function setReady(){


    for (var i = 150; i >= 30; i--) {
        BrightnessVolume = i;
        ws281x.setBrightness(i);
        sleep.usleep(3000);
    }
    speed = 80;

} 


function setActice(){
    
    for (var i = 30; i <= 250; i++) {
            BrightnessVolume = i;
            ws281x.setBrightness(i);
            sleep.usleep(3000);
    }
    speed = 20;

}


var offset = 0;
function rainbow(){

    //console.log("rainbow")
    
    
      for (var i = 0; i < NUM_LEDS; i++) {

        //console.log(colorwheel((offset + i) % 256));  
        pixelData[i] = rainbowheel((offset + i) % 256);


        //console.log((offset + i) % 256);
      }

      offset = (offset + 1) % 256;
      ws281x.render(pixelData);
      ws281x.setBrightness(BrightnessVolume);
      


    setTimeout(function () {
        rainbow();
    },speed);

}




function rainbowheel(pos) {

    param  = 3;

    pos = 255 - pos;
    if (pos < 85) { 

        //console.log("piros kek")
        return rgb2Int(255 - pos * param, 0, pos * param); 
    }

    if (pos < 170){
        //console.log("zold kek")
        pos -= 85; return rgb2Int(0, pos * param, 255 - pos * param); 
    }

    if (pos <= 255){
        //console.log("piros zold")
        pos -= 170; return rgb2Int(pos * param, 255 - pos * param, 0); 
    }
}


function rgb2Int(r, g, b) {

  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}


rainbow()



