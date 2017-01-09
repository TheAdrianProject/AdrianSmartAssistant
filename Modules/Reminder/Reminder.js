
 
var mysql = require('../../node_modules/mysql');

//JQuery like DOM parser
// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);



//timer
function Timer(ModuleParams){

    var strCommand = ModuleParams["text"];
    var strCommand = strCommand.toLowerCase();

    var strActionWord = "timer";

    // make all time measurements singular for the sql
    strCommand = strCommand.replace(/minutes/g,'minute');
    strCommand = strCommand.replace(/hours/g,'hour');
    strCommand = strCommand.replace(/days/g,'day');
    strCommand = strCommand.replace(/seconds/g,'second');

    // get the index of the action word so all searches for information about the timer
    // to be set can start after it's position
    var intIndexOfActionWord = strCommand.indexOf(strActionWord);

    // get the position of the first number in the sting (the length of the timer hopefully!)
    var intFirstNumberPosition = strCommand.search(/\d/);

    if(intFirstNumberPosition === -1){

        console.log('no timer length was found in your command');
        baseModel.LeaveQueueMsg("Speaker", "Speak",
            {'text':"Apologies, there was an error finding the timer length in your command"});
        process.exit();

    }


    // try and extract a description for the command from between the action word
    // and the timer length
    var strPossibleDescription = strCommand.substr((intIndexOfActionWord+strActionWord.length),
        (intFirstNumberPosition-(intIndexOfActionWord+strActionWord.length)));

    // if the last word of the descriptive section of the command
    // is 'for' or 'to' ect.. then remove it as it is likely not part of the description
    var arrPossibleDescription = strPossibleDescription.trim().split(" ");
    if(['for', 'to', 'in'].indexOf(arrPossibleDescription[(arrPossibleDescription.length-1)]) > -1){

        arrPossibleDescription.splice((arrPossibleDescription.length-1), 1);
    }
    var strTimerDescription = arrPossibleDescription.join(" ");

    console.log(strTimerDescription);

    // set the timer type
    if(strTimerDescription.length > 0){

        // event type = reminder (3)
        var intEventType = 3;
    }else{

        // event type = timer (2)
        var intEventType = 2;
    }

    // get the time
    var strTime = strCommand.substr(intFirstNumberPosition, (strCommand.length-intFirstNumberPosition));

    console.log(strTime);

    // Input the connection parameters
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : constants.DB_USER,
        password : constants.DB_PASS,
        database : constants.DB_NAME
    });

    // Connect to the database
    connection.connect(function(err){
        if(!err) {

            console.log("connection OK");
        } else {

            console.log("Error connecting database ...");
        }
    });

    console.log("before query")

    var query = " " +
        "INSERT " +
        "into adrian_new.events " +
        "(event_type, datetime, event_time, user_id, text) " +
        "VALUES ( " +
        intEventType + ", " +
        "now(), " +
        "DATE_ADD(NOW(), INTERVAL " + strTime + "), " +
        "1, " +
        "'" + strTimerDescription + "'" +
        ")";

    connection.query(query, function(err, rows, fields) {

        if (!err){

            baseModel.LeaveQueueMsg("Speaker", "Speak", {'text':"timer, " + strTimerDescription + ", is set for " + strTime});
            connection.end();

        }else{

            console.log(query);
            console.log("bad query");
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {'text':"Apologies, there was an error saving your new reminder"});
            process.exit();
        }

    })
} 

module.exports.Timer = Timer;