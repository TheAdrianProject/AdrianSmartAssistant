var fs      = require('fs');
var request = require('request');


// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);


function Switch(ModuleParams){

    // get the method id of the phillips hue module
    var methodId = ModuleParams['params']['method_id'];

    // get the object id of the light to be switched
    var objectId = ModuleParams['params']['object_id'];

    // get the action id from the params received so we know if we are
    // switching the light on (id = 1) or off (id = 2)
    var actionId = ModuleParams['params']['action_id'];

    // set the light action for the request
    if(actionId == 1){

        var lightOn = true;
    }else{

        var lightOn = false;
    }

    // if the location id is wildcard (nowhere) then set the location to the
    // adrian boxes local location id.. otherwise use the location id from the interpreter
    if(ModuleParams['params']['location_id'] === ModuleParams['params']['wildcard_location_id']){

        var locationId = ModuleParams['params']['location_id'];
    }else{

        var locationId = ModuleParams['params']['local_location_id'];
    }

    // get the mysql library object
    var mysql    = require('mysql');

    // input the connection parameters
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : constants.DB_USER,
        password : constants.DB_PASS,
        database : constants.DB_NAME
    });

    // connect to the database
    connection.connect(function(err){

        if(!err) {

            console.log("Database is connected ...");
        } else {

            console.log("Error connecting database ...");
            return false;
        }
    });

    // get the id of the light we need to switch and
    // the bridge ip and username
    var query = "SELECT " +
        "light_data.light_id, " +
        "bridge_ip_data.`value` as 'bridge_ip', " +
        "bridge_username_data.`value` as 'bridge_username' " +

        "FROM (SELECT " +
        "light_id_data.`value` as light_id " +
        "FROM " +
        "config as light_id_data " +

        "INNER JOIN location_objects " +
        "ON location_objects.location_id = " + locationId + " " +
        "AND location_objects.object_id = " + objectId + " " +
        "AND location_objects.id = light_id_data.location_object_id " +

        "WHERE " +
        "light_id_data.method_id = " + methodId + " " +
        "AND light_id_data.description = 'light id') as light_data " +

        "LEFT JOIN config as bridge_ip_data " +
        "ON bridge_ip_data.method_id = " + methodId + " " +
        "AND bridge_ip_data.description = 'bridge IP' " +

        "LEFT JOIN config as bridge_username_data " +
        "ON bridge_username_data.method_id = " + methodId + " " +

        "AND bridge_username_data.description = 'bridge username' ";

    console.log('query: ');
    console.log(query);

    connection.query(query, function(err, rows, fields) {

        if (!err){

            // if the database query was successful
            console.log('The response is: ', rows);

            // if the database query did not find a valid nest access token return false
            if(typeof rows[0] === 'undefined') {

                connection.end();
                console.log("no bridge ip or light id could be retrieved from the db");
                baseModel.LeaveQueueMsg("Speaker", "Speak",
                    {'text' : "Apologies, I am having trouble getting your hue bridge ip and " +
                    "light i.d. from my database."});

                return false;
            }

            // get the first row of the result
            var lightDetails = rows[0];

            // close the mysql connection
            connection.end();

            // check that the needed values were selected
            if(typeof lightDetails['light_id'] === 'undefined' ||
                lightDetails['light_id'] === null) {

                console.log("no light id could be retrieved from the db");
                baseModel.LeaveQueueMsg("Speaker", "Speak",
                    {'text' : 'Apologies, your hue light id could not be retrieved from ' +
                    'my database.'});

                return false;
            }
            if(typeof lightDetails['bridge_ip'] === 'undefined' ||
                lightDetails['bridge_ip'] === null) {

                console.log("no bridge ip could be retrieved from the db");
                baseModel.LeaveQueueMsg("Speaker", "Speak",
                    {'text' : 'Apologies, your hue bridge I.P. address could not be retrieved from ' +
                    'my database.'});

                return false;
            }
            if(typeof lightDetails['bridge_username'] === 'undefined' ||
                lightDetails['bridge_username'] === null) {

                console.log("no bridge username could be retrieved from the db");
                baseModel.LeaveQueueMsg("Speaker", "Speak",
                    {'text' : 'Apologies, your hue bridge username could not be retrieved from ' +
                    'my database.'});

                return false;
            }

            // send the put request to the bridge to tell the light to turn on
            //Load the request module
            request({
                url: 'http://' + lightDetails['bridge_ip'] + '/api/' + lightDetails['bridge_username'] + '/lights/' + lightDetails['light_id'] + '/state',
                method: 'PUT',
                json: {
                    on: lightOn
                }
            }, function(error, response, body){

                if(error) {

                    baseModel.LeaveQueueMsg("Speaker", "Speak",
                        {"text" : "There was an issue sending the request to your hue light."});
                    return false;
                } else {

                    if(typeof response.body[0]['success'] === 'undefined') {

                        baseModel.LeaveQueueMsg("Speaker", "Speak",
                            {'text' : "There was an error returned from your hue bridge."});

                        return false;
                    }

                    if(lightOn){

                        var OnOrOff = "on";
                    }else{

                        var OnOrOff = "off";
                    }

                    baseModel.LeaveQueueMsg("Speaker", "Speak",
                        {"text" : "The light has been turned " + OnOrOff});
                    return true;
                }
            });

        } else {

            // if the database query failed with an error log it
            console.log('Error while performing hue data select Query.');
            console.log(err);

            // close the mysql connection
            connection.end();

            // leave a message in the queue to trigger the Speaker module to
            // inform the user of the error
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {"text" : "I'm having a bit of trouble getting the details for your hue light from my database."});

            return false;
        }
    });

}


module.exports.Switch = Switch;