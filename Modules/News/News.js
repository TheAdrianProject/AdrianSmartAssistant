var fs = require('fs');  

//XML to JSON library
var parser = require('xml2json');

// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

//extract parameter
var paramArray = baseModel.parseParam(process.argv);
var text = paramArray["text"];

const execSync = require('child_process').execSync;


function GetNews(ModuleParams) {

	var text      = ModuleParams["text"];

	var newsType = ["uk",
	                "sport",
	                "technology",
	                "business",
	                "politics",
	                "science",
	                "world",
	                "football"];

	newsTypeFound = "";
	for (var i = 0 ; i < newsType.length; i++) {
	   
	    console.log(text+ " "+newsType[i]+ " :" +  text.indexOf(newsType[i]))
	    
	    if (text.indexOf(newsType[i])!=-1){ 
	        newsTypeFound = newsType[i];
	        break 
	    }
	}

	var url = "";
	switch(newsTypeFound) {
	    
	    case "football"	:  url="http://feeds.bbci.co.uk/sport/0/football/rss.xml?edition=uk";  break;
		
		case "sport"	:  url="http://feeds.bbci.co.uk/sport/0/rss.xml?edition=uk";  break;       
	    
	    case "technology": url="http://feeds.bbci.co.uk/news/technology/rss.xml";  break;
	    
	    case "business":   url="http://feeds.bbci.co.uk/news/business/rss.xml";  break;
	    
	    case "politics":   url="http://feeds.bbci.co.uk/news/politics/rss.xml";  break;
	    
	    case "science":    url="http://feeds.bbci.co.uk/news/science_and_environment/rss.xml";  break;
		
		case "uk":         url="http://feeds.bbci.co.uk/news/uk/rss.xml";  break;

	    case "world":      url="http://feeds.bbci.co.uk/news/world/rss.xml";  break;
	    
	    default:           url = "http://feeds.bbci.co.uk/news/rss.xml";
	}

	/*
	* Gooogle request, sync execution so the program waits for it's finishing
	*/

	console.log(url);

	execSync('curl -sA "Chrome" -L "'+url		//  XML feed source
			+'" -o '+constants.NEWS_TEMP_FILE   //  Save output to file
			,{stdio:"ignore"} );                //  Ignore response  

	/*
	* Reading the file
	*/


	fs. readFile(constants.NEWS_TEMP_FILE, 'utf8', function(err, body) {

		var NewsJson = parser.toJson(body);  
		var NewsObj = JSON.parse(NewsJson);

	    var newsCounter = 0;
	    var newsText = "Latest "+newsTypeFound+" news. ";
	    var NesItems =  NewsObj["rss"]["channel"]["item"]
	    for (var i = 0 ; i < NesItems.length; i++) {
		   
		   	console.log(i + " / "+constants.NEWS_LIMIT);

		    console.log(NesItems[i]["title"])
		    newsText+= NesItems[i]["title"] + " : ";

		    console.log(NesItems[i]["description"])
		    newsText+= NesItems[i]["description"] + " "
			
			//gives only the top NEWS_LIMIT (default : 5) news
		   	if (i>=constants.NEWS_LIMIT-1){
		   		break
		   	}

		  	console.log("-------------------------------------------------------")
		}
		
		baseModel.LeaveQueueMsg("Speaker", "Speak", {'text':newsText})
	  
	})

}


module.exports.GetNews = GetNews;
