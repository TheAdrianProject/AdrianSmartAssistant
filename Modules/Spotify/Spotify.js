/*
* Required Libraries
*/

// get the constants
var   constants    = require(__dirname + "/../../constants.js");

//chalk
var chalk = require(__dirname + '/../../node_modules/chalk');

// file handling
var fs = require('fs');  

// child process hander
const execSync   = require('child_process').execSync;

// get the base model
var baseModel = require(constants.BASE_MODULE);

if (typeof constants.SPOTIFY_USERNAME == 'undefined'|| 
    typeof constants.SPOTIFY_PASSWORD == 'undefined'|| 
    constants.SPOTIFY_USERNAME.length<=0 || 
    constants.SPOTIFY_PASSWORD.length<=0){

    console.log(chalk.red("\n[ ERROR : Spotify module needs to be configured before play music ]\n"));
    console.log(chalk.red("\n[ Please set up SPOTIFY_USERNAME, SPOTIFY_PASSWORD values in the constants.js file ]\n"));
    console.log(chalk.red("\n[ See documnetation in the constants.js or on www.theadrianproject.com ]\n"));
    return false

}


function Play(ModuleParams){

    var searchText  = ModuleParams["text"];
    searchText      = searchText.toLowerCase();    
    
    //removing command words
    var textArray = searchText.split("play");
    //var searchText="";

    console.log("textArray: "+textArray);
    searchText = textArray[1];


    // Encode querystring with +
    var searchText = searchText.replace(/ /g ,"+")

    /*
    * Sportify API request
    */

    var ModulExec = execSync('curl -sA "Chrome" -L "https://api.spotify.com/v1/search'
                            +'?q='+searchText                               //  Search term
                            +'&type=track'                                  //  Search type
                            +'&market=GB'                                   //  Market
                            +'&limit=1" '+                                  //  API Result limit we need only one
                            '-o '+constants.SPOTIFY_SEARCH_LOG,             //  Save the response to log file
                            {stdio:"ignore"} );                             //  Ignore command response

    /*
    * Reading the file
    */

    fs. readFile(constants.SPOTIFY_SEARCH_LOG, 'utf8', function(err, body) {

        try {

            var sportifyArray = JSON.parse(body)
            //get first hit

            console.log(sportifyArray)
            var firstHit = sportifyArray["tracks"]["items"][0]["uri"];



        } catch (e) {
            console.log("API response is not a valid JSON");
            process.exit() 
        }

        
        //  Clear MPC cache 
        var ModulExec = execSync('mpc clear'        , {stdio:"ignore"} ); 
        
        //  App new song to MPC
        var ModulExec = execSync('mpc add '+firstHit, {stdio:"ignore"} ); 
        
        //  Start Playing the song
        var ModulExec = execSync('mpc play'         , {stdio:"ignore"} );
        
    })

}

module.exports.Play = Play;