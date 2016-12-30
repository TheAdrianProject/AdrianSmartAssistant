// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License. 

'use strict';

var constants = require("../../constants.js");
var ansi = require('ansi');
var setenv = require('setenv');

process.env.GOOGLE_APPLICATION_CREDENTIALS = constants.GOOGLE_APPLICATION_CREDENTIALS;
process.env.GCLOUD_PROJECT = constants.GCLOUD_PROJECT;

setenv.set('GOOGLE_APPLICATION_CREDENTIALS', constants.GOOGLE_APPLICATION_CREDENTIALS);
setenv.set('GCLOUD_PROJECT', constants.GCLOUD_PROJECT);


var cursor = ansi(process.stdout);
var chalk = require('chalk');
var async = require('async');
var fs = require('fs');
var path = require('path');
var grpc = require('grpc');
var googleProtoFiles = require('google-proto-files');
var googleAuth = require('google-auto-auth');
var Transform = require('stream').Transform;
var	spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var ansi = require('ansi');
var fs = require('fs');
var cursor = ansi(process.stdout);

//Lets require/import the HTTP module
var http = require('http');
var url = require("url");

//Lets define a port we want to listen to
const PORT=9950;

// [START proto]
var PROTO_ROOT_DIR = googleProtoFiles('..');
var mic = null;
var protoDescriptor = grpc.load({
      root: PROTO_ROOT_DIR,
      file: path.relative(PROTO_ROOT_DIR, googleProtoFiles.speech.v1beta1)
    }, 'proto', {
      binaryAsBase64: true,
      convertFieldsToCamelCase: true
    });

var speechProto = protoDescriptor.google.cloud.speech.v1beta1;
// [END proto]

//We need a function which handles requests and send response
function handleRequest(request, response){

    var method = url.parse(request.url).query;

    if (method=="startListening"){

        //var reqestCommand = "GOOGLE SPEACH DEAMON : Start Recognition";
        // send a request to the light to show it is listening
        sendNeoActive();
        // say yes and then start the recognition within a callback after Adrian has finished
        // saying yes so it does not hear itself
        var ModulExec = exec('play '+__dirname+'/../../Assets/yes.wav',
            function(err, stdout, stderr) {

                response.end('{"service":"started"}');
                startMic();
                main('speech.googleapis.com');
            });
    }

    if ( method=="stopListening"){

        //var reqestCommand = "GOOGLE SPEACH DEAMON : Stop Recognition";
        response.end('{"service":"stopped"}');
        stopMic();


    }
    //console.log(chalk.blue("GOOGLE SPEACH DEAMON request: "+ method)); 
    //console.log(chalk.blue(reqestCommand));

    response.end('{"service":"running"}');

}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    //console.log(chalk.gray("*** Webserver listening on: http://localhost:%s", PORT));
    console.log(chalk.green("GOOGLE SPEACH DEAMON : Port listening on : http://localhost:", PORT));
});


function getTimeStamp(index){

    var today = new Date();

    var y = today.getFullYear()+"/"+today.getMonth()+"/"+today.getDate()+" ";
    y+= today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()+" "
    y+= today.getMilliseconds()
}


function exit(err) {
    //lightshow.stop();
    console.log(chalk.red("GOOGLE SPEACH DEAMON : exit due to error"));
    //console.error(err.stack || err);
    process.exit(1);
}

function updateLine(text) {
    cursor.horizontalAbsolute(0).eraseLine().write(text);
}

var senteceLog = __dirname+"/../../Modules/Listener/Log/lastSentense.json"



function startMic(){

   
    mic = spawn('arecord', ['--device=plughw:1,0', '--format=S16_LE', '--rate=16000', '--disable-softvol','--channels=1']); //, '--duration=10'
    console.log(chalk.gray("GOOGLE SPEACH DEAMON : Turn microphone on"));
    console.log(Date.now());
}

function stopMic(){

    console.log(chalk.gray("GOOGLE SPEACH DEAMON : Stop Microphone"));
    //mic.stdout.unpipe(transcriptInput);
    mic.kill();
    //record.stop();
}


// [START authenticating]
function getSpeechService (host, callback) {
  var googleAuthClient = googleAuth({
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform'
    ]
  });

  googleAuthClient.getAuthClient(function (err, authClient) {
    if (err) {
      console.log(chalk.red("GOOGLE SPEACH DEAMON AUTH ERROR : Please check your GOOGLE_APPLICATION_CREDENTIALS file ( constans.js) "))
      return callback(err);
    }

    var credentials = grpc.credentials.combineChannelCredentials(
      grpc.credentials.createSsl(),
      grpc.credentials.createFromGoogleCredential(authClient)
    );

    //console.log('Loading speech service...');
    var stub = new speechProto.Speech(host, credentials);
    //console.log(stub)

    console.log(chalk.green("GOOGLE SPEACH DEAMON : Speech service is loaded"))
    return callback(null, stub);
  });
}
// [END authenticating]

function main ( host) {
  async.waterfall([
    function (cb) {
      getSpeechService(host, cb);
      //console.log("start");
    },
    // [START send_request]

    function sendRequest (speechService, cb) {

        console.log(chalk.green('GOOGLE SPEACH DEAMON : Analyzing speech...'));
        //console.log(Date.now());
        var responses = [];
        var call = speechService.streamingRecognize();

        // Listen for various responses
        call.on('error', cb);
        call.on('data', function (recognizeResponse) {

            if (recognizeResponse) {
                //console.log(JSON.stringify(recognizeResponse))
                responses.push(recognizeResponse);
                if (recognizeResponse.results && recognizeResponse.results.length) {
                    //console.log(JSON.stringify(recognizeResponse.results, null, 2));

                    var thissentenceJson  = JSON.stringify(recognizeResponse.results, null, 2);

                    var sentence = recognizeResponse.results[0].alternatives[0]["transcript"];
                    //if sentense has been finished and the sentense has reasonable length


                    console.log("sentence : "+sentence);


                    //leave message for the listerner module to pass to interpreter
                    fs.appendFile(senteceLog, sentence, function (err) {
                        //console.log(sentence+' was left in the lastSentense log')

                    });



                    stopMic();
                }
            }
        });
        call.on('end', function () {
            //console.log("end");
            //cb(null, responses);
        });

        // Write the initial recognize reqeust
        call.write({
            streamingConfig: {
                config: {
                    encoding: 'LINEAR16',
                    sampleRate: 16000

                },
                interimResults: false,
                singleUtterance: true
            }
        });

        var toRecognizeRequest = new Transform({ objectMode: true });
        toRecognizeRequest._transform = function (chunk, encoding, done) {
            done(null, {
                audioContent: chunk
            });
        };
        //console.log(Date.now());
        mic.stdout.pipe(toRecognizeRequest)
            .pipe(call);
    }
    // [END send_request]
  ]);
}

function sendNeoActive(){

  http.get({
    hostname: 'localhost',
    port: 9150,
    path: '/?active',
    agent: false  // create a new agent just for this one request
  }, (res) => {
    
  });

}


