var fs = require('fs');   

//JQuery like DOM parser

// get the constants
var constants = require(__dirname + "/../../constants.js");
const execSync = require('child_process').execSync;

// get the base model
var baseModel = require(constants.BASE_MODULE);

var fs = require('fs');


function GetJoke(ModuleParams){ 

	var ModulExec = execSync('curl -sA "Chrome" -L "http://tambal.azurewebsites.net/joke/random" -o '+constants.JOKES_TEMP_JSON
							, {stdio:"ignore"} ); //hide it with ignore

	fs.readFile(constants.JOKES_TEMP_JSON, 'utf8', function(err, body) {

		var JokesArray = JSON.parse(body)

		baseModel.LeaveQueueMsg("Speaker", "Speak", {'text':JokesArray["joke"]})
		
	})

}


module.exports.GetJoke = GetJoke;