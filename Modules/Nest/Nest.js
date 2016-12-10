
// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

// get node modules
var mysql     = require('mysql');
var request   = require('request');



module.exports.ChangeTemperature = ChangeTemperature;



function ChangeTemperature(ModuleParams)
{
    console.log('Start of changeTemperature');

    // get the required temperature from the command
    var numTemperature = ModuleParams.text.match(/\d+/)[0];

    // check if we definitely got a number
    if (isNaN(numTemperature)) {

        console.log('This is not a number');
    }

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

            // leave a message in the queue to trigger the Speaker module to
            // inform the user of the error and return false
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {"text" : "There was an issue connecting to my database. " +
                "If I continue to have this issue I might need to see a developer."});

            return false;
        }
    });

    // get the latest nest access token then
    // send the change temperature call
    getAccessToken(connection, sendChangeTemperatureCall.bind({'numTemperature' : numTemperature}));
}

















function sendChangeTemperatureCall(accessToken, url, numTemperature)
{
    console.log('SENDING CHANGE TEMPERATURE CALL');

    // if numTemperature was not received then
    // get the temperature setting that was binded to this function in the
    // when initially passed as a callback from the 'changeTemperature' function
    // to the 'getAccessToken' function
    if(typeof numTemperature === 'undefined' || numTemperature === null){

        numTemperature = this.numTemperature;
    }

    numTemperature = numTemperature/1;

    console.log('TARGET TEMPERATURE');
    console.log(numTemperature)

    // check if a specific url has been provided to the function
    // (this can happen if nest return a http 307 code telling us to
    // redirect the request)
    if(typeof url === 'undefined' || url === null){

        url = 'https://developer-api.nest.com/devices/thermostats/xeXye2XzFMyzAJtU_6pb-qNOQH-HY-fT?auth=' +
            accessToken;
    }

    var arrBody = {"target_temperature_c" : numTemperature};

    request({
        url: url,
        method: 'PUT',
        headers: {
            'Content-Type': 'MyContentType'
        },
        body: JSON.stringify(arrBody)
    }, function(error, response, body){

        if(error) {

            console.log('ERROR');
            console.log(error);

            // leave a message in the queue to trigger the Speaker module to
            // inform the user of the error and return false
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {"text" : "There was an issue sending the temperature change request to Nest. " +
                "If I continue to have this issue I might need to see a developer."});

            return false;

        } else {

            console.log('SUCCESS');
            console.log(response.statusCode, body);
            console.log(response.headers);

            if(response.statusCode === 307){

                // if a 307 was returned then get the new url from the header and resend
                // the request to the new url

                if(typeof response.headers.location === 'undefined'){

                    // if no redirect url was provided by nest in the response header
                    baseModel.LeaveQueueMsg("Speaker", "Speak",
                        {"text" : "There was an issue sending the temperature change request to Nest. " +
                        "If I continue to have this issue I might need to see a developer."});

                    return false;
                }

                sendChangeTemperatureCall(accessToken, response.headers.location, numTemperature)

            }else if(response.statusCode !== 200){

                // if no redirect url was provided by nest in the response header
                baseModel.LeaveQueueMsg("Speaker", "Speak",
                    {"text" : "There was an issue sending the temperature change request to Nest. " +
                    "If I continue to have this issue I might need to see a developer."});

                return false;
            }else{

                // success, temperature changed
                console.log('temperature successfully changed');

                baseModel.LeaveQueueMsg("Speaker", "Speak",
                    {"text" : "The temperature has been changed to " + numTemperature + "degrees."});

                return true;
            }
        }
    });
}




function getAccessToken(connection, callbackFunction)
{
    console.log('GETTING ACCESS TOKEN FROM DATABASE');

    // query the database
    var query = "SELECT " +
        "`value` as access_token " +
        "FROM " +
        "config " +
        "" +
        "INNER JOIN methods " +
        "ON config.method_id = methods.id " +
        "" +
        "AND methods.name = 'nest' " +
        "AND config.description = 'access token'";

    connection.query(query, function(err, rows, fields) {

        if (err !== null){

            // if the database query failed with an error log it
            console.log('Error while performing Query.');
            console.log(err);

            // close the mysql connection
            connection.end();

            // leave a message in the queue to trigger the Speaker module to
            // inform the user of the error and return false
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {"text" : "I am having trouble getting your nest access token from my database. " +
                "If I continue to have this issue I might need to see a developer."});

            return false;

        } else {

            // if the database query was successful
            console.log('The response is: ', rows);

            // if the database query did not find a valid nest access token return false
            if(typeof rows[0] === 'undefined' || typeof rows[0]['access_token'] === 'undefined') {

                console.log("no nest access token found in the db");
                getNewAccessToken(connection, callbackFunction);
                return false;
            }

            // close the mysql connection
            connection.end();

            // get the access token from the result
            var accessToken = rows[0]['access_token'];

            // pass the token to the callback function given
            callbackFunction(accessToken);
        }
    });
}





function getNewAccessToken(connection, callbackFunction)
{
    console.log('TRYING TO GET NEW ACCESS TOKEN');

    // query the database
    var query = "SELECT " +
        "config.`value` as user_access_code " +
        "FROM " +
        "config " +
        "INNER JOIN methods " +
        "ON config.method_id = methods.id " +
        "AND methods.name = 'nest' " +
        "AND config.description = 'user access code'";

    connection.query(query, function(err, rows, fields) {

        if (err !== null){

            // if the database query failed with an error log it
            console.log('Error while performing Query.');
            console.log(err);

            connection.end();
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {"text" : "I am having trouble getting your nest access token from my database. " +
                "If I continue to have this issue I might need to see a developer."});
            return false;

        } else {

            // if the database query was successful
            console.log('The response is: ', rows);

            // if the database query did not find a valid nest access token return false
            if(typeof rows[0] === 'undefined' || typeof rows[0]['user_access_code'] === 'undefined') {

                console.log("no user access token found in the db");

                // close the mysql connection
                connection.end();

                // leave a message in the queue to trigger the Speaker module to
                // inform the user of the error and return false
                baseModel.LeaveQueueMsg("Speaker", "Speak",
                    {"text" : "I am having trouble getting your user access token from my database. " +
                    "If I continue to have this issue I might need to see a developer."});
                return false;
            }

            // get the user access code from the result
            var userAccessCode = rows[0]['user_access_code'];

            // send the put request to the bridge to tell the light to turn on
            //Load the request module
            request({
                url: 'https://api.home.nest.com/oauth2/access_token?' +
                'client_id=b554ca65-b5ca-4aee-a71e-f1eb8f3bfb0b' +
                '&code=' + userAccessCode +
                '&client_secret=WiRU0k3wb79VSKc7hMgoHAWIH' +
                '&grant_type=authorization_code',
                method: 'POST'
            }, function(error, response, body){

                if(error) {

                    console.log('There was an issue requesting a new access token from Nest');
                    connection.end();
                    baseModel.LeaveQueueMsg("Speaker", "Speak",
                        {"text" : "There was an issue requesting a new access token from Nest. " +
                        "If I continue to have this issue I might need to see a developer."});
                    return false;

                } else {

                    console.log('NEST NEW TOKEN RESPONSE');
                    console.log(body);

                    // convert the response into an array
                    var arrResponse = JSON.parse(body);

                    if(typeof arrResponse['access_token'] === 'undefined'){

                        // if there was no access token received
                        console.log('no token received');
                        connection.end();
                        baseModel.LeaveQueueMsg("Speaker", "Speak",
                            {"text" : "There was an issue requesting a new access token from Nest. " +
                            "If I continue to have this issue I might need to see a developer."});
                        return false;

                    }else{

                        // if an access token was received
                        console.log('access token received');
                        var accessToken = arrResponse['access_token'];

                        saveNewAccessToken(accessToken, connection, callbackFunction)
                    }
                }
            });
        }
    });
}



function saveNewAccessToken(accessToken, connection, callbackFunction)
{
    console.log('SAVING ACCESS TOKEN');

    // query the database
    var query = "INSERT INTO " +
        "config " +
        "(method_id, " +
        "location_object_id, " +
        "description, " +
        "`value`) " +
        "VALUES " +
        "((SELECT id FROM methods WHERE `name` = 'nest'), " +
        "31, " +
        "'access token', " +
        "'" + accessToken + "') " +
        "ON DUPLICATE KEY UPDATE " +
        "`value` = '" + accessToken + "'";

    connection.query(query, function(err, rows, fields) {

        if (err !== null){

            // if the database query failed with an error log it
            console.log('Error while performing Query.');
            console.log(err);

            connection.end();
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {"text" : "I am having trouble saving your nest access token into my database. " +
                "If I continue to have this issue I might need to see a developer."});
            return false;

        } else {

            connection.end();
            callbackFunction(accessToken);
        }
    });
}