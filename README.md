
# AdrianSmartAssistant

--------------------------------------------------------------------------

Copyright [2016] [Gergely Hajcsak & Jamie Deakin - The Adrian Team]

Webiste : www.theadrianproject.com

Email : team@theadrianproject.com

Licence : Licensed under the Apache License, Version 2.0

--------------------------------------------------------------------------


Introducing Adrian, your advanced open source Home Smart Assistant. Bringing simplicity to your home through voice automation. 
Get a morning news update, stream music, control your smart devices & ask just about anything. 


How to configure 
--------------------------------------------------------------------------

To start playing with Adrian the core modules need to be configured.
There are two core modules:

	1.  Google Speech to Text Service Module
	2.  Ivona Text to Speech Module
	3.  SnowBoy hotword file configuration (optional)

There are then three main commands to start, stop and update adrian:

	4.  Start Adrian
	5.  Stop Adrian
	6.  Update Adrian

--------------------------------------------------------------------------
All module configuration changes can be done in the constants.js file
--------------------------------------------------------------------------

1. Configuring Google Speech to Text Service Module
--------------------------------------------------------------------------

All users need a Google Speech Service Account which can be obtained
online. If you don't have one yet get it from https://cloud.google.com/speech .
Google Speech Service is free up to a certain monthly limit. 

Once you have registered you will be issued a:
	- project_id 
	- google application credential file

The google application credential file can be downloaded at https://console.developers.google.com/project/_/apis/credentials .
Once you have your google application credential file copy it to the '/Library/googleSpeech/Account/' folder .
Then Change the constants.js replacing the values starting with 'YOUR_' below:

	define("GOOGLE_APPLICATION_CREDENTIALS", __dirname  + "/Library/googleSpeech/Account/YOUR_PROJECT_FILE_NAME_COMES_HERE")
	define("GCLOUD_PROJECT", "YOUR_PROJECTN_NAME_COMES_HERE")


2. Configuring Ivona Text to Speech Module
--------------------------------------------------------------------------

All users also need an Ivona account.  If you dont have one get it at  https://www.ivona.com .
It is a very easy process, just pick the free plan option and register.
Once you have your Ivona credentials change the constants.js repacling the values starting with 'YOUR_' below:

	define("IVONA_ACCESSKEY", "YOUR_IVONA_ACCESSKEY_COMES_HERE");
	define("IVONA_SECRETKEY", "YOUR_IVONA_SECRETKEY_COMES_HERE");


3. SnowBoy hotword file configuration 
--------------------------------------------------------------------------
The great Showboy offline hotword recognition gives Adrian the ability to 
recognize and wake up when you say the name Adrian. Every person pronunciation is different
but Adrian must recognize all of us. For this Adrian needs a good configuration.
The configuraion is a file. if Adrian is not able to recognize when you say Adrian
then you have to record your voice on a showboy webiste. https://snowboy.kitt.ai/dashboard
The whole process takes about 3 minutes but gives almost 100% recognition rate.

Go to the dashboard and search for "Adrian". Set up your personal model with the microphone icon.
Follow the steps and download the output file and replace the file below with the new file.
Keep the name of the file.

	Library/Showboy/Adrian.pmdl


4.  Start Application
--------------------------------------------------------------------------

	./adrian.sh

5.  Stop Appilication
--------------------------------------------------------------------------

The application can be stopped any time pressing CTRL+C .
To then clear memory & kill all depedencies the below command can be run:

	./stop.sh


6. Update Adrian
--------------------------------------------------------------------------

in the AdrianSmartAssistant folder execute the below command. Before execution
commit all of your local changes.

	./update.sh


