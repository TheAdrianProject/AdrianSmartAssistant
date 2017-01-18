

var constants = require(__dirname + "/../../constants.js");
const execSync = require('child_process').execSync;

// get the base model
var baseModel = require(constants.BASE_MODULE);

var mysql = require('../../node_modules/mysql');
var connection = null;

console.log(__dirname)


function dbConn(){

    // Input the connection parameters
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : constants.DB_USER,
        password : constants.DB_PASS,
        database : constants.DB_NAME
    });

    // Connect to the database
    connection.connect(function(err){
        if(!err) {
            console.log("Database is connected ");
            //console.log(connection)
           
        } else {
            console.log("Error connecting database ...");
        }
    });

}


function checkEvents(){


    var query = "SELECT * , UNIX_TIMESTAMP(event_time) as timestamp FROM adrian_new.events where active = 1";

    connection.query(query, function(err, rows, fields) {

            if (!err){

                // if the database query was successful
                //console.log("count :"+rows.length)

                for (var i = 0; i < rows.length; i++) {

                    if (rows[i]["timestamp"]/1<=Math.floor(Date.now() / 1000)/1) {

                        //console.log("ativate alert : "+rows[i]["evnet_type"]);
                        
                        if (rows[i]["event_type"]==2){

                            //simple timer    

                            execSync('play '+__dirname+'/../../Assets/alert.mp3', {stdio:"ignore"} ); 
                            execSync('play '+__dirname+'/../../Assets/alert.mp3', {stdio:"ignore"} ); 
                            execSync('play '+__dirname+'/../../Assets/alert.mp3', {stdio:"ignore"} ); 

                        }else{

                            baseModel.LeaveQueueMsg("Speaker", "Speak",
                                {'text' : 'Reminder, ' + rows[i]["text"]});
                        }
                        
                        //update record to inactive    
                        getEventDeactivete(rows[i]["id"])
                        
                    }else{

                        if ((rows[i]["timestamp"] - Math.floor(Date.now() / 1000) ) <  120 ){

                            console.log("later event. time left : "+ (rows[i]["timestamp"] - Math.floor(Date.now() / 1000) ))
                            
                        }
                        
                    }
                    
                }
                
               
        }else{

            console.log("bad query ")

        }
    })
}

function  getEventCheck(){

    setInterval(function(){
        
        if (connection){
        
            checkEvents()
            
        }
        else{

            console.log("Db connection is not ready yet.")
        }    

        },1000
    )


}

function getEventDeactivete(id){

    var query = "Update adrian_new.events set active = 0 where id = "+id;

    connection.query(query, function(err, rows, fields) {

        if (!err){

            //console.log(rows)

                
        }else{

            console.log("bad query ")

        }
    })

}

// connect to db
dbConn()

// expose module
module.exports.getEventCheck = getEventCheck;
module.exports.getEventDeactivete = getEventDeactivete;
