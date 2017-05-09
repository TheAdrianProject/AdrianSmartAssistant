
// get the constants
var constants = require(__dirname + "/../constants.js");

// get the file system library
var fs = require('fs');

module.exports = { 

    /**
     * parseParam
     *
     * gets the parameters passed to the module from the brain
     */
    parseParam: function parseParam(commandParam){

        //console.log('command param received from module');
        console.log(commandParam);

        if (typeof commandParam[2] == 'undefined' || commandParam[2] == null){
            console.log("{'code':'401','message':'missing parameter'}")
            //process.exit()
        }

        //replaces spaces
        commandParam[2] = commandParam[2].replace("[_]"," ") 

        try {
            var paramJson = JSON.parse(commandParam[2]);
            
        } catch (e) {
            console.log("{'code':'402','message':'Parameter is not valid Json'}")
            //process.exit()
        }

        //console.log(" Got parameter : ")
        //console.log(paramJson);

        return paramJson
    },

    /**
     * addJobToQueue
     *
     * adds a job into the queue for processing
     *
     * @param job
     */
    LeaveQueueMsg: function LeaveQueueMsg(Module, Action, Params){

        //console.log("YOU MADE IT HERE!!");
        
        console.log(Module);
        console.log(Action);
        console.log(Params);

        messageArray = {"actions": 
                            [{
                            "Module": Module, 
                            "Action": Action,
                            "Params": Params }
                        ]
                        }
        messageJson = JSON.stringify(messageArray) 
        fs.appendFile(constants.QUEUE, messageJson, function (err) {
                   
        });
    }

};