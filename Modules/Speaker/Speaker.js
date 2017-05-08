
// load file hander lib
var fs = require('fs');  

//load cripto lib
var _hash = require('crypto-toolkit').Hash('hex');

// get the constants
var constants = require(__dirname + "/../../constants.js");

// load child process hander
const execSync = require('child_process').execSync;

// Chalk for coloring console messages
var chalk = require('../../node_modules/chalk');

var baseModel = require(constants.BASE_MODULE);

/*
* Speak Function using Ivona Library
*/

function Speak(ModuleParams){

    var text = ModuleParams["text"]
    var mode = ModuleParams["mode"]

    //speak on facebook
    if (mode == "facebook"){

        baseModel.LeaveQueueMsg("Facebook", "Message", {"message":text,"threadId":ModuleParams["threadId"]})

    }

    // speak on speaker
    if (mode == "natural"){

        //console.log(ModuleParams["text"])
        var textHash = _hash.sha256(text);

        console.log(constants.IVONA_TEMP_DIR+textHash+'.mp3')
        
        if (fs.existsSync(constants.IVONA_TEMP_DIR+textHash+'.mp3')) {
            
            var ModulExec = execSync('sudo play '+constants.IVONA_TEMP_DIR+textHash+'.mp3', {stdio:"ignore"} ); //hide it with ignore
            
        }else{
            
            var ivona = new (require('../../node_modules/ivona-node'))({
                accessKey: constants.IVONA_ACCESSKEY,
                secretKey: constants.IVONA_SECRETKEY
            });

            //  ivona.createVoice(text, config)
            //  [string] text - the text to be spoken
            //  [object] config (optional) - override Ivona request via 'body' value
            
            var w = fs.createWriteStream(constants.IVONA_TEMP_DIR+textHash+'.mp3');

            var voice = ivona.createVoice(text, {
                body: {
                    voice: {
                        name:  constants.IVONA_VOICE, 
                        language: constants.IVONA_LANG,
                        gender: constants.IVONA_GENDER 
                    }
                }
            }).pipe(w);

            w.on('finish', function(){

                fs.readFile(constants.IVONA_TEMP_DIR+textHash+'.mp3', 'utf8', function (err,data) {
                    if (err) {

                        console.log(chalk.red("SPEAKER MODUEL : Can't open speech file."))
                        return false
                    }

                    try {

                        var errorMsg = JSON.parse(data);
                        console.log(chalk.red("SPEAKER MODUEL : Ivona error message"))
                        console.log(errorMsg)   

                    } catch (e) {
                        
                        var ModulExec = execSync('play '+constants.IVONA_TEMP_DIR+textHash+'.mp3', {stdio:"ignore"} ); //hide it with ignore
                    
                    }

                });

            });
        }

    }

    

}

/* Expose Module */
module.exports.Speak = Speak;

//Good news, You are online again.
//You have lost Internet connectivity
//Yes
//Sorry, I cannot connect to the Internet
