
var constants = require(__dirname + "/../../constants.js");

var mysql = require('../../node_modules/mysql');
var connection = null;
dbConn()

function dbConn(){

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
            console.log("Database is connected ...");
            //console.log(connection)
           
        } else {
            console.log("Error connecting database ...");
        }
    });

}


function checkEvents(){


    var query = "SELECT * FROM adrian_new.events where active = 1";

    connection.query(query, function(err, rows, fields) {

            if (!err){

                // if the database query was successful

                console.log('The response is: ', rows);

                // get the first row of the result
                //var result = rows[0];

                // close the mysql connection
               
        }else{

            console.log("bad query ")

        }
    })
}

function  getEventCheck(){

    setInterval(function(){
        console.log("check events");

        //console.log(connection)

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

                console.log(rows)
                
        }else{

            console.log("bad query ")

        }
    })

}

getEventCheck()

getEventDeactivete(1)

