var fs = require('fs');  

//XML to JSON library
var parser = require('xml2json');

// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

//library for exec
const execSync   = require('child_process').execSync;

// Load ChromeCast Lib
var scanner = require('chromecast-scanner');


function Play(ModuleParams){ 

	var searchText      = ModuleParams["text"];

	/*
	* Clean search text from command 
	*/ 
	text = text.replace(/play/g,'');
	text = text.replace(/on tv/g,'');
	text = text.replace(/on my tv/g,'');
	text = text.replace(/on chromecast/g,''); 
	text = text.replace(/on my chromecast/g,''); 

	scanner(function(err, service) {
	  
		if (err!=null){

			console.log("Sorry, but I cannot finf you chromecast device. Make sure your TV is on and you chromecast is plugged in")
			return false;

		}
		
	  	console.log('chromecast %s running on: %s',
		    service.name,
		    service.data);

		var search = require('youtube-search');
		 
		var opts = {
		  maxResults: 1,
		  key: constants.YOTUBE_API_KEY
		};
		
		console.log("final search term : "+ text)

		search(text, opts, function(err, results) {
		  if(err) return console.log(err);
		 
		  	//console.dir(results);
			//var YouTubeObj = JSON.parse(results);
			console.dir(results[0]["id"]);
			var ModulExec = execSync('curl -H “Content-Type: application/json” http://'
					+service.data
					+':8008/apps/YouTube -X POST -d "v='
					+results[0]["id"]+'"',
				{stdio:"ignore"} );

		});

	});

}


module.exports.Play = Play;

