
 
var mysql = require('../../node_modules/mysql');

//JQuery like DOM parser
// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);


//extract parameter
/*
var paramArray = baseModel.parseParam(process.argv);
var text = paramArray["text"];
var text = paramArray["text"].toLowerCase();
*/

//timer
function Timer(ModuleParams){

    var text = ModuleParams["text"];
    var text = text.toLowerCase();

    var text = text.toLowerCase();
    var commands = [     "set timer",
                        //"remind me",
                        //"set reminder",
                ];

    isword1 = false;
    for (var i = 0; i < commands.length; i++) {
       
        if (text.indexOf(commands[i])!=-1) {
            isword1 = true;
            break
        }
    }

    // set timer command found
    if (isword1) {

        text = text.replace(/set/g,'');
        text = text.replace(/timer/g,'');
        text = text.replace(/ for /g,'');
        text = text.replace(/ to /g,'');
        text = text.replace(/ in /g,'');

        text = text.replace(/minutes/g,'minute');
        text = text.replace(/hours/g,'hour');
        text = text.replace(/days/g,'day');
        text = text.replace(/seconds/g,'second');
        
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
            "(event_type,datetime,event_time,user_id,text) " +
            "VALUES( " +
            "2, " +
            "now(), " +
            "DATE_ADD(NOW(), INTERVAL "+text+"), " +
            "1, " +
            "''" 
         + ")";

        connection.query(query, function(err, rows, fields) {

            if (!err){
                    

                    baseModel.LeaveQueueMsg("Speaker", "Speak", {'text':"timer is set."+text})
                    connection.end();

            }else{

                    console.log(query)
                    console.log("bad query")
                    baseModel.LeaveQueueMsg("Speaker", "Speak", {'text':"Sorry, didn't catch it"})
                    process.exit()
                }
        
        })


    }

} 

module.exports.Timer = Timer;