var fs = require('fs');  

//JQuery like DOM parser
$ = require('cheerio');

// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

var Entities = require('html-entities').XmlEntities;
entities = new Entities();
const execSync = require('child_process').execSync;

/*
* Gooogle request, sync execution so the program waits for it's finishing
*/

function Search(ModuleParams){

	var searchText      = ModuleParams["text"];

	//var request = require('request');
	var striptags = require('striptags');
	var searchText = searchText.replace(" ","+")
	var searchText = searchText.replace(/ /g ,"+")

	console.log('"http://www.google.com/search'
	        +'?hl='+constants.GOOGLE_LANG       //  Search language
	        +'&oe=utf8'                         //  Output encoding
	        +'&q='+searchText                   //  Query string
			+'&num=1'							//  Return only 1 result to save time
	        )


	var request = require('request');

	// Set the headers
	var headers = {
	    'User-Agent':       'Chrome'
	}

	// Configure the request
	var options = {
	    url: 'http://www.google.com/search',
	    method: 'GET',
	    headers: headers,
	    qs: {
	            'hl': constants.GOOGLE_LANG, 
	            'oe': 'utf8',
	            'q': searchText,
	            'num':'1',
	            'ir':'lang_en'
	        }
	}

		// Start the request
		request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        // Print out the response body
	        
		    console.log("downloaded")
		    // result variable init
			var found = 0;
			
			if (!found && $('._m3b',body).length>0){

				found = $('._m3b',body).html()
		    				
			}

			//facts
			if (!found && $('._tXc>span',body).length>0){

				found = $('._tXc>span',body).html()
		    				
			}

			//facts
			if (!found && $('._sPg',body).length>0){


				found = " "+$('._sPg',body).html()
				    				
			}
			
			//instant + description
			if (!found && $('._Oqb',body).length>0){


				found = $('._Oqb',body).html()

				//how many
		    	if ( $('._Mqb',body).length>0){

		    		console.log("how many")
		    		found+= " "+$('._Mqb',body).html()
		    	}
			}

			//how many
			if (!found && $('._m3b',body).length>0){

				found = $('._m3b',body).html()

				//how many
		    	if ( $('._eGc',body).length>0){

		    		found+= $('._eGc',body).html()
		    	}
			}


			//Time, Date
			if (!found && $('._rkc._Peb',body).length>0){

			 	found = $('._rkc._Peb',body).html()
				    				
			}

			//Math 	
			if (!found && $('.nobr>.r',body).length>0){


				found = $('.nobr>.r',body).html()
				    				
			}

			//simpe answere
			if (!found && $('.obcontainer',body).length>0){

				found = $('.obcontainer',body).html()
				    				
			}
		       
		    //Definition
			if (!found && $('.r>div>span',body).first().length>0){

				found = $('.r>div>span',body).first().html()

				//how many
		    	if ( $('.g>div>table>tr>td>ol',body).length>0){

		    		found+= " "+$('.g>div>table>tr>td>ol',body).html()
		    	}
			}
		    

		    //TV show
		    if (!found && $('._B5d',body).length>0){
				
				found = $('._B5d',body).html()

				//how many
		    	if ( $('._Pxg',body).length>0){

		    		found+= ". "+$('._Pxg',body).html()
		    	}

				//how many
		    	if ( $('._tXc',body).length>0){

		    		found+= ". "+$('._tXc',body).html()
		    	}
			}
			
		    //Weather
		  	if (!found && $('.g>.e>h3',body).length>0){
				
				found = $('.g>.e>h3',body).html()

				//how many
		    	if ( $('.wob_t',body).first().length>0){

		    		found+= " "+ $('.wob_t',body).first().html()
		    	}

				//how many
		    	if ( $('._Lbd',body).length>0){

		    		found+= " "+ $('._Lbd',body).html()
		    	}
			}      


			GoogleResponse = entities.decode(striptags(found));
			console.log(GoogleResponse);
			if (GoogleResponse=="") GoogleResponse = "I am sorry, I dont have answer for that."

			//$('._tXc>span',body).length
			baseModel.LeaveQueueMsg("Speaker", "Speak", {'text':GoogleResponse})
	    }
	})



	

		
	  



}

module.exports.Search = Search;