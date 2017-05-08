
"use strict";


// get the constants
var constants = require(__dirname + "/../../constants.js");

// get the base model
var baseModel = require(constants.BASE_MODULE);

// get node modules
const snowboy = require('snowboy');



class KeywordRecognition {

    constructor() {

        this.isRecognitionLive = false;
    }

    StartKeywordRecognition()
    {
        console.log('Starting Snowboy Keyword Recognition');

        if(this.isRecognitionLive === false){

            this.record = require('node-record-lpcm16');

            const models = new snowboy.Models();

            models.add({
                file: '/home/pi/AdrianSmartAssistant/Library/Snowboy/Adrian.pmdl',
                sensitivity: '0.55',
                hotwords : 'adrian'
            });

            const detector = new snowboy.Detector({
                resource: "/home/pi/AdrianSmartAssistant/node_modules/snowboy/resources/common.res",
                models: models,
                audioGain: 2.0
            });

            detector.on('silence', function () {

                //  console.log('silence');
            });

            detector.on('sound', function () {

                //  console.log('sound');
            });

            detector.on('error', function () {

                console.log('SNOWBOY : ERROR!');
            });

            detector.on('hotword', function (index, hotword) {

                this.record.stop();
                this.isRecognitionLive = false;
                baseModel.LeaveQueueMsg("Listener", "start_listener", {});
            }.bind(this));

            var mic = this.record.start({
                threshold: 0,
                verbose: false
            });

            mic.pipe(detector);
            this.isRecognitionLive = true;
            console.log('Started recognition');
        }
    }

    StopKeywordRecognition()
    {
        console.log('Stopping Snowboy Keyword Recognition');

        if(this.isRecognitionLive === true){

            console.log('Stopped recognition');
            this.record.stop();
            this.isRecognitionLive = false;
        }
    }

}

module.exports = new KeywordRecognition();