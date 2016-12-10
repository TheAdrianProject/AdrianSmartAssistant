
var fs = require('fs');  
var ts = require('../../node_modules/tail-stream');
var http = require("http");
var chalk = require('chalk');

// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

console.log("Listener started")

/* 
* Set up File Stream Handler
*/ 

var tstream = ts.createReadStream(constants.GOOGLESPEECH_LIVE_RESPONSE_LOG, {
    beginAt: 0,
    onMove: 'follow',
    detectTruncate: false,
    //onTruncate: 'end',
    //endOnError: false
});

/*
* File Tail-er
*/

function startQueueTail(){

    console.log("tailing start")

    tstream.on('data', function(data) {
        data = ""+data
        console.log("got data: " + data);
        baseModel.LeaveQueueMsg("Interpreter","interpret", {"text":data,"mode":"natural"});
        //console.log('message was left in the queue')
        fs.truncate(constants.GOOGLESPEECH_LIVE_RESPONSE_LOG, 0, function(){
                //console.log(' lastSentense file truncated')
                process.exit() 
        })
         
    })

}

function StartListenerDeamon(){

  http.get({
    hostname: 'localhost',
    port: 9950,
    path: '/?startListening',
    agent: false  // create a new agent just for this one request
  }, (res) => {
    
  });

}

function StopListenerDeamon(){

  http.get({
    hostname: 'localhost',
    port: 9950,
    path: '/?stopListening',
    agent: false  // create a new agent just for this one request
  }, (res) => {
        process.exit() 
  });

}


function Start_listener(ModuleParams){

    
    startQueueTail()
    StartListenerDeamon()

    // it allows users 6s to finish the question
    setTimeout(function(){


        console.log(chalk.red("\n[ LISTENER : Time limit reached. Stopping GoogleSpeech.]"))
        StopListenerDeamon()
       
    },6000)
    


}


module.exports.Start_listener = Start_listener;