
/*******************************************************************

Adrian Application Config File

This file stores all important 
	Application varaibales 
	DataBase Connection Parameters
	Account Keys
	Modules Settings
	Other Settings
 ******************************************************************/ 

/**
 * constants.define
 *
 * sets a value in the constant object
 *
 * @param name
 * @param value
 */
	function define(name, value) {
	    Object.defineProperty(exports, name, {
	        value:      value,
	        enumerable: true
	    });
	}

/*******************************************************************
 *	Adrian Main File Loactions - change is not recommended
 ******************************************************************/ 

	// Main App Location
	define("APP_LOCATION", __dirname);

	// Command queue file location
	define("QUEUE", __dirname + "/queue.json");

	// BaseModule file location 
	define("BASE_MODULE", __dirname + "/Modules/BaseModule.js");


/*******************************************************************
 *	Database connection params
 ******************************************************************/ 

	define("DB_NAME", "adrian_new");
	define("DB_USER", "root");
	define("DB_PASS", "root");


/*******************************************************************
 *	Core Modules Settings
 *	THESE MUST SET UP. ALL MANDATORY
 ******************************************************************/ 
	
	/* 
	   For Seech to Text Service 
	   If you dont have get one at 
	   https://cloud.google.com/speech
		
	To get the GOOGLE_APPLICATION_CREDENTIALS file you need to download it form your google developer console
	and copy it to Library/googleSpeech/Account/ folder	
	Example :
	define("GOOGLE_APPLICATION_CREDENTIALS", __dirname  + "/Library/googleSpeech/Account/your-project-file-xxxxaaaabbb.json")
	define("GCLOUD_PROJECT", "raspi-voice-1165") */

	define("GOOGLE_APPLICATION_CREDENTIALS", __dirname  + "/Library/googleSpeech/Account/.......json")
	define("GCLOUD_PROJECT", "")

	// Google Speech Service final response text log
	define("GOOGLESPEECH_LIVE_RESPONSE_LOG", __dirname + "/Modules/Listener/Log/lastSentense.json")
	
	/* Google Search Settings */
	
	define("GOOGLE_TEMP", __dirname + "/Modules/Google/Temp/Google.html");
	define("GOOGLE_LANG", __dirname + "en");

	/* Ivona 
	   For Text to Speech Service 
	   If you dont have one get it at 
	   https://www.ivona.com */

	define("IVONA_ACCESSKEY", "");
	define("IVONA_SECRETKEY", "");

	define("IVONA_TEMP_DIR",  __dirname + "/Modules/Speaker/Temp/");

	define("IVONA_VOICE",	"Brian");
	define("IVONA_LANG", 	"en-GB");
	define("IVONA_GENDER", 	"Male"); 
	
	/* Speaker module */
	define("SPEAKER_TEMP_DIR", __dirname + "/Modules/Speaker/Temp/");


/*******************************************************************
 * Optional Factory Modules 
 ******************************************************************/ 

	/* New Module for BBC new */
	define("NEWS_TEMP_FILE", __dirname + "/Modules/News/Temp/newTemp.xml");
	define("NEWS_LIMIT", 5 );

	/* Spotify Module*/

	//define("SPOTIFY_USERNAME", "");
	//define("SPOTIFY_PASSWORD", "");

	define("MOPIDY_CONFIG_FILE","/etc/mopidy/mopidy.conf");

	define("SPOTIFY_SEARCH_LOG", __dirname + "/Modules/Spotify/Temp/spotify.json");

	/* Youtube for ChromeCast Module
	   If you dont have one get it at 
	   https://developers.google.com/youtube/v3/getting-started */
	
	//define("YOTUBE_API_KEY", "");

	/* Facebbok for Adrian App */
	//define("FACEBOOK_USERNAME", "");
	//define("FACEBOOK_PASSWORD", "" );

/*******************************************************************
 *	Optional Modules 
 *  Example Module and it's settings
 ******************************************************************/ 

	/* Jokes module */
	define("JOKES_TEMP_JSON", __dirname + "/Modules/Jokes/Temp/jokes.json");


/*******************************************************************
 *	Other Settings Application Settings
 ******************************************************************/ 
	
	/* Volume level */
	define("MASTER_VOLUME",8);

	/* Volume level 
		1 - all main info (default for normal usage in beta stage)
		2 - all main info and all module response, recommended for development
	*/

	define("DEBUG_LEVEL",2);
