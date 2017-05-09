
//colored messages
var chalk = require('chalk');

// get the constants
var constants = require(__dirname + "/../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

//extract modules parameter
var moduleSettings = baseModel.parseParam(process.argv);

console.log("\n********PARAMS************\n");
var d = new Date();
var n = d.getTime();
console.log("Time : "+n/1000)
console.log("Module : "+capitalize(moduleSettings["Module"]) )
console.log("Action : "+capitalize(moduleSettings["Action"]) )
console.log("Params : "+moduleSettings["Params"] )
console.log("Mode : "+moduleSettings["Params"]["mode"] )
console.log("ThreadId : "+moduleSettings["Params"]["threadId"] )
console.log("\n**************************\n");

try {
   	var module = require(constants.APP_LOCATION+"/Modules/"+capitalize(moduleSettings["Module"])+
   		"/"+capitalize(moduleSettings["Module"])+'.js');
	module[capitalize(moduleSettings["Action"])](moduleSettings["Params"]);

} catch (e) {
	
	console.log(chalk.red("------------------------\n"));
	console.log(chalk.red("Module died ("+moduleSettings["Module"]+")"))
	console.log(chalk.red(e));
	console.log(chalk.red("\n------------------------"));
}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
