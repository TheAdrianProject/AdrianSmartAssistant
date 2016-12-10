
// load file hander lib
var fs = require('fs');  

//facebook lib
var login = require("facebook-chat-api");

// get the constants
var constants = require(__dirname + "/../../constants.js");

/*
* Message Function 
*/

function Message(ModuleParams){

    var message = ModuleParams["message"];
    var threadId = ModuleParams["threadId"]
    login({email: constants.FACEBOOK_USERNAME , password: constants.FACEBOOK_PASSWORD}, function callback (err, api) {

        if(err) return console.error(err);

        api.sendMessage(message, threadId);

    });

}

/* Expose Module */
module.exports.Message = Message;

