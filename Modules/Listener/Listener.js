
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
    detectTruncate: false
});

/*
* File Tail-er
*/

function startQueueTail(){

    console.log("tailing start")

    tstream.on('data', function(data) {

        var textChunk = data.toString('utf8');

        if(textChunk === "{{NO_SOUND_RECOGNISED}}"){

            console.log("NO SOUND RECOGNISED");
            fs.truncate(constants.GOOGLESPEECH_LIVE_RESPONSE_LOG, 0, function(err) {

                if (err) {
                    console.log(err);
                }

                StopListenerDeamon()
            });
        } else {

            console.log("got data: ");
            console.log(textChunk);
            baseModel.LeaveQueueMsg("Interpreter","interpret", {"text":textChunk, "mode":"natural"});
            //console.log('message was left in the queue')
            fs.truncate(constants.GOOGLESPEECH_LIVE_RESPONSE_LOG, 0, function(err){

                if (err) {
                    console.log(err);
                }
                console.log(' lastSentense file truncated');
                StopListenerDeamon()
            })
        }
         
    });

    tstream.on('end', function() {

        StopListenerDeamon();
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

    console.log('stopping listener deamon');

  http.get({
    hostname: 'localhost',
    port: 9950,
    path: '/?stopListening',
    agent: false  // create a new agent just for this one request
  }, (res) => {

      console.log('stoped listener deamon');
      process.exit();
  });

}


function Start_listener(ModuleParams){

    
    startQueueTail()
    StartListenerDeamon()

    // it allows users 6s to finish the question
    //setTimeout(function(){
    //
    //
    //    console.log(chalk.red("\n[ LISTENER : Time limit reached. Stopping GoogleSpeech.]"))
    //    StopListenerDeamon()
    //
    //},6000)
    


}


module.exports.Start_listener = Start_listener;