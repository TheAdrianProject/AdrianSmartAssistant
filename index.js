/***************************************************************************************
 Require modules
 **************************************************************************************/
var exec = require('child_process').exec;
var fs = require('fs');  
var ts = require('tail-stream');
var chalk = require('chalk');
var sleepTime = require('sleep-time');
const execSync = require('child_process').execSync;
var http = require("http");
const spawn = require('child_process').spawn;
//var Event = require('./Library/EventChecker');
const KeywordRecognition = require('./Library/Snowboy/Snowboy');

/***************************************************************************************
 Load App config file
 **************************************************************************************/

var constants = require(__dirname + "/constants.js");


/***************************************************************************************
 App and environmental setting Init  
 **************************************************************************************/

console.log(chalk.blue("\n[------------------------------------ APP INIT -------------------------------------]"))

if (typeof constants.GOOGLE_APPLICATION_CREDENTIALS == 'undefined' || 
    typeof constants.GCLOUD_PROJECT == 'undefined' ||  
    constants.GOOGLE_APPLICATION_CREDENTIALS.length<=0 ||  
    constants.GCLOUD_PROJECT.length<=0){

    console.log(chalk.red("\n[ ERROR : Core Modules (Google Speech Service, Ivona) need to be configured before start]\n"));
    console.log(chalk.red("\n[ Please set up GOOGLE_APPLICATION_CREDENTIALS, GCLOUD_PROJECT values in the constants.js file ]\n"));
    console.log(chalk.red("\n[ See documnetation in the constants.js or on www.theadrianproject.com ]\n"));
    var ModulExec = execSync('killall php nodejs node python cu cat mpg123 play' , {stdio:"ignore"}); //hide it with ignore
    process.exit(1);

}


if (typeof constants.IVONA_ACCESSKEY == 'undefined'|| 
    typeof constants.IVONA_SECRETKEY == 'undefined'|| 
    constants.IVONA_ACCESSKEY.length<=0 || 
    constants.IVONA_SECRETKEY.length<=0){

    console.log(chalk.red("\n[ ERROR : Core Modules (Google Speech Service, Ivona) need to be configured before start ]\n"));
    console.log(chalk.red("\n[ Please set up IVONA_ACCESSKEY, IVONA_SECRETKEY values in the constants.js file ]\n"));
    console.log(chalk.red("\n[ See documnetation in the constants.js or on www.theadrianproject.com ]\n"));
    var ModulExec = execSync('killall php nodejs node python cu cat mpg123 play' , {stdio:"ignore"}); //hide it with ignore
    process.exit(1);

}


/***************************************************************************************
 Truncate Log files  
 **************************************************************************************/

execSync('truncate -s 0 queue.json', {stdio:"ignore"} );
execSync('truncate -s 0 Modules/Listener/Log/lastSentense.json', {stdio:"ignore"} );



// get the base model
var baseModel = require(constants.BASE_MODULE);

/* 
* Global Variables
*/

var queue = [];
var actions = [];
var BrainStatus = 0;
var file = constants.QUEUE;
var messageMode = "natural"; //or facebook
var messageThreadId; //for facebook messages


/***************************************************************************************
 Set up Action Queue File Stream Handler
 **************************************************************************************/
 
var tstream = ts.createReadStream(file, {
    beginAt: 0,
    onMove: 'follow',
    detectTruncate: false,
    //onTruncate: 'end',
    //endOnError: false
});


/***************************************************************************************
 File Tail-er
 **************************************************************************************/

function startQueueTail(){

    //console.log("tailing start")

    tstream.on('data', function(data) {
        data = ""+data
        //console.log("got data: " + data);
        
        arrayOfLines = data.match(/[^\r\n]+/g); 
        for (var i in arrayOfLines) {
            val = arrayOfLines[i];
           
            try {
                var lineArray = JSON.parse(val);
               
            } catch (e) {
                console.log(i +" : not JSON");
                break;
            }

            // all fine - put that is the queue
            queue.push(lineArray);
            // start fill up the action queuq
            feedActionQueue(lineArray)
            // start processing the action queue
            processActions()
        }

    })

}



/***************************************************************************************
 Feed the action queue from the new job queue entrie
 **************************************************************************************/

function feedActionQueue(val){


    //console.log("feedActionQueue")
    console.log(val)

    for (var i in val['actions']) {

        actions.push(val['actions'][i])
    }
    console.log("actions")
    console.log(actions);

}


/***************************************************************************************
 Loop through action queue and take the first one  
 **************************************************************************************/


function processActions(){

    if (BrainStatus == 1) {

        return false;
    }

    console.log("Check for available actions");

    if (actions.length === 0) {

        console.log("No more action waiting");
        if (messageMode === "natural") {

            StartKeywordRecognition();
        }
        
        console.log("BRAINSTATUS : " + BrainStatus);
        if (BrainStatus === 0) {

            console.log(chalk.green("\n[ ADRIAN STAND BY ]"))
        }
        return  true;
        
    }

    console.log(chalk.blue("\n[------------------------------------ MODULE START ------------------------------------]"))
    console.log(actions[0]) 

    //make sure it passes the message mode (natural/facebook)
    if (typeof actions[0]["Params"]["mode"] == 'undefined') {
         
        console.log("adding message mode : " + messageMode) 
        actions[0]["Params"]["mode"] =  messageMode;
        actions[0]["Params"]["threadId"] =  messageThreadId; 
        
    }else{

        messageMode = actions[0]["Params"]["mode"];

        if (actions[0]["Params"]["mode"]=="facebook"){
            messageThreadId = actions[0]["Params"]["threadId"];
        }
    }

    //pass it for execution
    executeModuel(actions[0])
    actions.shift();
    
}

/***************************************************************************************
 Start Snowboy keyword spotting 
 **************************************************************************************/

function StartKeywordRecognition()
{
    KeywordRecognition.StartKeywordRecognition();
    
    //sendNeoReady();
}

/***************************************************************************************
 Execute Action with calling the Module - passing all parameters  
 **************************************************************************************/

function executeModuel(ModuleSettings){

    BrainStatus = 1;
    //console.log("BRAINSTATUS : "+BrainStatus)

    var moduleSettingsJson = JSON.stringify(ModuleSettings);
    
    //load module
    console.log(chalk.green("exec : "+ 'node Brain/Brain.js'+ ' \''+JSON.stringify(ModuleSettings)+'\'' ))

    //moduleSettingsJson = moduleSettingsJson.replace(" ","[_]")
    const ls = spawn('node', ['Brain/Brain.js',moduleSettingsJson ]);

    // stdoutput of a module    
    ls.stdout.on('data', (data) => {
        
        if (constants.DEBUG_LEVEL>1){
            console.log(data.toString('utf8'));    
        }
        
    });
    
    // if error happens
    ls.stderr.on('data', (data) => {
        console.log("Brain died due to fatal error!");
    });

    // module finish
    ls.on('close', (code) => {
        //console.log(`child process exited with code ${code}`);
        BrainStatus = 0;
        processActions()
    });

    console.log(chalk.blue("\n[------------------------------------ MODULE COMPLETE -----------------------------------]"))

}


/***************************************************************************************
 Send Ready messae to NoePixer Deamon - This is the light which comes up when you say Adrian
 **************************************************************************************/

function sendNeoReady(){
  
  http.get({
    hostname: 'localhost',
    port: 9150,
    path: '/?ready',
    agent: false  // create a new agent just for this one request
  }, (res) => {
    
  });

}


/***************************************************************************************
 FaceBook message handler
 **************************************************************************************/


var login = require("facebook-chat-api");


if (    typeof constants.FACEBOOK_USERNAME !== 'undefined' && 
        typeof constants.FACEBOOK_PASSWORD !== 'undefined' && 
        constants.FACEBOOK_USERNAME !="" && 
        constants.FACEBOOK_PASSWORD!="" ){

    console.log("Facebook Login Attempt");
    login({email: constants.FACEBOOK_USERNAME , password: constants.FACEBOOK_PASSWORD}, function callback (err, api) {
        if(err) return console.error(err);

        api.setOptions({listenEvents: true});

        var stopListening = api.listen(function(err, event) {
            if(err) return console.error(err);

                switch(event.type) {
                case "message":

                    api.markAsRead(event.threadID, function(err) {
                    if(err) console.log(err);
                    });

                    console.log(chalk.blue("\n[------------------------------------ Facebook Message  -----------------------------------]"))
                    console.log(chalk.blue("\nThread ID : "+event.threadID))
                    console.log(chalk.blue("\n"+event.body))
                    console.log(chalk.blue("\n[------------------------------------------------------------------------------------------]"))
                    baseModel.LeaveQueueMsg("Interpreter","interpret", {"text":event.body,"mode":"facebook","threadId":event.threadID});
                    break;

                case "event":
                    console.log(event);
                break;
            }
        })
    })
}

/***************************************************************************************
 Usage Log
 **************************************************************************************/

var http = require("http");
var SerialNum = exec("cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2", function(err, stdout, stderr){
    if (serialNumber!="")
        var serialNumber = stdout;
    else
        var serialNumber = "undefined";

    var LogReq = exec("wget -qO- http://www.theadrianproject.com/check_in/check-in.php?serial="+serialNumber+" &> /dev/null ", function(err, stdout, stderr){

        console.log(stdout);
    })
});


/***************************************************************************************
 Spotify module accoount setup on start 
 **************************************************************************************/


if (typeof constants.SPOTIFY_USERNAME !== 'undefined' && 
    typeof constants.SPOTIFY_PASSWORD !== 'undefined' && 
    constants.SPOTIFY_USERNAME.length>0 && 
    constants.SPOTIFY_PASSWORD.length>0){

    fs.stat(constants.MOPIDY_CONFIG_FILE, function(err, data) { 
        if (!err){
            fs.readFile(constants.MOPIDY_CONFIG_FILE, 'utf8', function (err,data) {
                if (err) {
                    console.log(chalk.red("\n[ ERROR : can't find Mopidy config file : "+ constants.MOPIDY_CONFIG_FILE +" ]\n"))
                }
                var result = data.replace(/username =.*/, 'username = '+constants.SPOTIFY_USERNAME);
                var result = result.replace(/password =.*/, 'password = '+constants.SPOTIFY_PASSWORD)

                fs.writeFile(constants.MOPIDY_CONFIG_FILE, result, 'utf8', function (err) {

                if (err){
                    return console.log(chalk.red("\n[ ERROR : can't write Mopidy config file : "+ constants.MOPIDY_CONFIG_FILE +" ]"))
                }else{

                    console.log(chalk.blue("\n[SERVICE : Restarting Mopidy for Spotify]"))
                    var ModulExec = execSync(' sudo service mopidy restart', {stdio:"ignore"} ); 

                }
              })
            })

        } 
        else 
            console.log('Mopidy config file does not exist'); 
    }); 

}




/***************************************************************************************
 Start App functions
 **************************************************************************************/

// start action queue tail
startQueueTail();

// set neofixel light ready
//sendNeoReady();

// start snowBoy keyword spotting
StartKeywordRecognition();

// Start event checking
//Event.getEventCheck() 
