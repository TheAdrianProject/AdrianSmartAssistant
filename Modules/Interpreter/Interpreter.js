
// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

// get the mysql library object
var mysql      = require('mysql');




function Interpret(ModuleParams){

    // get the search text
    var searchText      = ModuleParams["text"];

    // convert the search text to lowercase
    searchText          = searchText.toLowerCase();

    // trim any whitespace from the serach text
    searchText          = searchText.trim();

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

            //console.log("Database is connected ...");
        } else {

            console.log("Error connecting database ...");
            return false;
        }
    });
    
    // escape serach text for query
    var searchTextEscaped = searchText.replace(/'/g , "\'");

    // query the database to try and find an action for the searchtext
    var query = "SELECT " +
        "base_data.location_object_id, " +
        "base_data.action_id, " +
        "base_data.action_name, " +
        "base_data.module, " +
        "base_data.action, " +
        "base_data.description, " +
        "base_data.params, " +
        "base_data.object_id, " +
        "base_data.action_id, " +
        "base_data.method_id, " +
        "base_data.description_id, " +
        "base_data.location_id, " +
        "box_locations.is_local as is_local, " +
        "box_locations.ip_address as ip_address, " +
        "local_box_location.location_id as local_location_id, " +
        "wildcard_location.id as wildcard_location_id, " +
        "remote_data.button_name as remote_button_name " +
        "FROM " +

        "(SELECT " +
        "module_functions.module as module, " +
        "module_functions.function as action, " +
        "module_functions.params as params, " +
        "objects.id as object_id, " +
        "locations.id as location_id, " +
        "actions.id as action_id, " +
        "actions.name as action_name, " +
        "location_object_method_actions_descriptions.method_id as method_id, " +
        "descriptions.id as description_id, " +
        "descriptions.description as description, " +
        "location_objects.id as location_object_id " +
        "FROM " +
        "location_object_method_actions_descriptions " +

        "INNER JOIN location_objects " +
        "ON location_object_method_actions_descriptions.location_object_id = location_objects.id " +

        "INNER JOIN locations " +
        "ON location_objects.location_id = locations.id " +

        "INNER JOIN language_locations " +
        "ON language_locations.location_id = locations.id " +

        "INNER JOIN objects " +
        "ON location_objects.object_id = objects.id " +

        "INNER JOIN language_objects " +
        "ON language_objects.object_id = objects.id " +

        "INNER JOIN method_actions " +
        "ON location_object_method_actions_descriptions.method_id = method_actions.method_id " +
        "AND location_object_method_actions_descriptions.action_id = method_actions.action_id " +

        "INNER JOIN actions " +
        "ON method_actions.action_id = actions.id " +

        "INNER JOIN language_actions " +
        "ON language_actions.action_id = actions.id " +

        "INNER JOIN descriptions " +
        "ON location_object_method_actions_descriptions.description_id = descriptions.id " +

        "INNER JOIN language_descriptions " +
        "ON language_descriptions.description_id = descriptions.id " +

        "INNER JOIN module_functions " +
        "ON method_actions.module_function_id = module_functions.id " +

        "INNER JOIN languages " +
        "ON language_locations.language_id = languages.id " +
        "AND language_objects.language_id = languages.id " +
        "AND language_actions.language_id = languages.id " +

        "INNER JOIN boxes as box_config " +
        "ON box_config.is_local = 1 " +
        "AND box_config.language_id = languages.id " +

        "WHERE " +
        "? LIKE CONCAT('%', language_actions.description, '%', language_descriptions.description, '%', language_objects.description, '%', language_locations.description, '%') " +
        "OR " +
        "? LIKE CONCAT('%', language_actions.description, '%', language_locations.description, '%', language_descriptions.description, '%', language_objects.description, '%') " +
        "OR " +
        "? LIKE CONCAT('%', language_descriptions.description,'%', language_locations.description, '%', language_objects.description, '%', language_actions.description) " +

        "ORDER BY " +
        "language_objects.description DESC, " +
        "language_descriptions.description DESC, " +
        "language_locations.description DESC " +
        "LIMIT 1) as base_data " +

        "LEFT JOIN (SELECT " +
        "buttons.`name` as button_name, " +
        "button_actions.action_id as action_id, " +
        "remote_buttons.location_object_id as location_object_id " +
        "FROM " +
        "remote_buttons " +

        "INNER JOIN buttons " +
        "ON remote_buttons.button_id = buttons.id " +

        "INNER JOIN button_actions " +
        "ON buttons.id = button_actions.button_id) AS remote_data " +
        "ON base_data.action_id = remote_data.action_id " +
        "AND base_data.location_object_id = remote_data.location_object_id " +

        "LEFT JOIN boxes as box_locations " +
        "ON box_locations.location_id = base_data.location_id " +

        "LEFT JOIN boxes as local_box_location " +
        "ON local_box_location.is_local = 1 " +

        "LEFT JOIN locations as wildcard_location " +
        "ON wildcard_location.name = 'WILDCARD'";

    var arrBindingValues = [searchTextEscaped, searchTextEscaped, searchTextEscaped];

    connection.query(query, arrBindingValues, function(err, rows, fields) {

        if (!err){

            // if the database query was successful
            //console.log('The response is: ', rows);

            // get the first row of the result
            var result = rows[0];

            // close the mysql connection
            connection.end();

            // if the database query did not find a valid action for the command
            if(result == null) {

                //console.log("no command found by the interpreter in the db");

                baseModel.LeaveQueueMsg("google", "search",
                    {"text" : searchText});

                return true;
            }

            // format the parameters array
            if(result['params'] != null){

                // add the search text to the params if needed
                result['params'] = result['params'].replace('{SEARCH_TEXT}', searchText);

                // decode the params json array
                result['params'] = JSON.parse(result['params']);
            }

            var params = {
                'params'               : result['params'],
                'object_id'            : result['object_id'],
                'location_id'          : result['location_id'],
                'local_location_id'    : result['local_location_id'],
                'wildcard_location_id' : result['wildcard_location_id'],
                'object_id'            : result['object_id'],
                'is_local'             : result['is_local'],
                'ip_address'           : result['ip_address'],
                'remote_button_name'   : result['remote_button_name'],
                'method_id'            : result['method_id'],
                'action'               : result['action'],
                'action_id'            : result['action_id']
            };

            // send the action to the queue
            baseModel.LeaveQueueMsg(result['module'],
                result['action'],
                {"text" : searchText,
                    "params" : params});

            return true;

        } else {

            // if the database query failed with an error log it
            console.log('Error while performing interpreter Query.');
            console.log(err);

            // close the mysql connection
            connection.end();

            // leave a message in the queue to trigger the Speaker module to
            // inform the user of the error
            baseModel.LeaveQueueMsg("Speaker", "Speak",
                {"text" : "I'm having a bit of trouble thinking. If I don't start to feel better soon I might need to get checked out."});

            return false;
        }
    });

}

module.exports.Interpret = Interpret;
