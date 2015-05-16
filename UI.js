/**
 * Created by Chad Luangrath on 4/28/2015.
 */

process.stdin.resume();
process.stdin.setEncoding('utf8');

var util = require('util');
var main = require("./Main.js");
var messenger = require('messenger');
var childProcess = require("child_process");
var config = require('./Config.js');
var Resource = require('./ResourceManager/models/Resource/Resource.js');
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');

var server = messenger.createListener(10003);
var mainSpeaker = messenger.createSpeaker(10000);

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gossip');
var db = mongoose.connection;

var query = Resource.find().sort({name: 1});
var resources = new Array();

query.exec(function(error, docs) {
    resources = docs;
});

console.log("Welcome to the JS P2P system!\n");
console.log("Please enter a command:");
console.log("---------------------------------");

help();

process.stdin.on('data', function (text) {
    text = text.toLowerCase().trim();

    if (text !== 'quit' &&
        text !== 'help' &&
        text.indexOf('search') < 0 &&
        text.indexOf('request') < 0 &&
        text !== 'join' &&
        text.indexOf('resource') < 0) {
        console.log("You did not enter a valid command. Please enter a valid command.");
        return;
    }

    if (text === 'quit') {
        done();
        return;
    }
    if (text === 'help') {
        help();
        return;
    }
    if (text.indexOf('search') >= 0) {
        if (text.indexOf('--') < 0) {
            console.log("There was no search request. Did you format the query correctly?");
            return;
        }

        var searchPhrase = text.substring(text.indexOf('--') + 2, text.length);
        search(searchPhrase);
    }
    if (text.indexOf('request') >= 0) {
        if (text.indexOf('--') < 0) {
            console.log("There was no resource request. Did you format the query correctly?");
            return;
        }

        var requestText = text.substring(text.indexOf('--') + 2, text.length - 1);
        requestResource(requestText);
    }
    if (text === 'join') {
        //join the P2P system
    }
    if (text.indexOf("resource") >= 0) {
        if (text.indexOf("show") >= 0) {
            console.log("I have " + resources.length + " resources in my collection!\n");

            for(var i = 0; i < resources.length; i++) {
                var resourceDetailString = "Filename: " + resources[i].name + " | " + "Description: " + resources[i].description + " | tags: ";

                for(var j = 0; j < resources[i].tags.length; j++) {
                    resourceDetailString += resources[i].tags[j] + " ";
                }

                console.log(resourceDetailString);
            }
        }
        else if (text.indexOf("rename") >= 0) {

            var firstDashes = text.indexOf("--");
            var secondDashes = text.indexOf("--", firstDashes + 1);

            var oldName = text.substring(firstDashes, secondDashes).replace("--", "").trim();
            var newName = text.substring(secondDashes).replace("--", "").trim();

            var renameResourcePayload = {
                oldResourceName: oldName,
                newResourceName: newName
            };

            console.log("Sending payload to Main.js");
            mainSpeaker.request('ui-resource-rename', renameResourcePayload, function(status) {
                console.log("Status from renaming: " + status);
            });
            console.log("Sent payload to Main.js");

        }
        else if (text.indexOf("description") >= 0) {

            var firstDashes = text.indexOf("--");
            var secondDashes = text.indexOf("--", firstDashes + 1);

            var resourceName = text.substring(firstDashes, secondDashes).replace("--", "").trim();
            var description = text.substring(secondDashes).replace("--", "").trim();

            var descriptionPayload = {
                resourceName: resourceName,
                description: description
            };

            console.log("descriptionPayload: ", descriptionPayload);
            mainSpeaker.request('ui-resource-description', descriptionPayload, function(status) {
               console.log("Status from description: ", status);
            });
        }
        else if (text.indexOf("tags add") >= 0) {
            var firstDashes = text.indexOf("--");
            var secondDashes = text.indexOf("--", firstDashes + 1);

            var resourceName = text.substring(firstDashes, secondDashes).replace("--", "").trim();
            var tagString = text.substring(secondDashes).replace("--", "").trim();

            var tagsToAdd = tagString.split(',');

            var tagAddPayload = {
                resourceName: resourceName,
                tagsToAdd: tagsToAdd
            };

            mainSpeaker.request('ui-resource-add-tags', tagAddPayload, function(status) {
                console.log("Status from adding tags: ", status);
            });
        }
        else if (text.indexOf("tags remove") >= 0) {
            var firstDashes = text.indexOf("--");
            var secondDashes = text.indexOf("--", firstDashes + 1);

            var resourceName = text.substring(firstDashes, secondDashes).replace("--", "").trim();
            var tagString = text.substring(secondDashes).replace("--", "").trim();

            var tagsToRemove = tagString.split(',');

            var tagRemovePayload = {
                resourceName: resourceName,
                tagsToRemove: tagsToRemove
            };

            mainSpeaker.request('ui-resource-remove-tags', tagRemovePayload, function(status) {
                console.log("Status from removing tags: ", status);
            });
        }
        else {
            console.log("You did not enter a valid command. Please enter a valid command.");
        }
    }

});

function done() {
    console.log("Quitting the P2P system!");
    process.exit();
}

function search(searchPhrase) {
    console.log("you searched for " + searchPhrase);
    mainSpeaker.request('ui-resource-search', searchPhrase, function(status) {

    });
}

function requestResource(resourceName) {
    console.log("you requested " + resourceName);
}

function help() {
    console.log("search --searchPhrase | Search for resources using the searchPhrase");
    console.log("request --resourceName | Request a resource by the resource name");
    console.log("resource show | Show and manage my resources");
    console.log("resource rename --resourceName --newReso nurceName | Rename one of your resources");
    console.log("resource description --resourceName --newDescription | Change the description of --resourceName");
    console.log("resource tags add --resourceName --tag1, tag2, tag3, tag4 | Add new tags to --resourceName");
    console.log("resource tags remove --resourceName --tag1, tag2, tag3, tag4 | Remove tags from --resourceName");
    console.log("join | Join the P2P network");
    console.log("quit | Quit the P2P network");
    console.log("help | See a list of available commands");
}

server.on('main-to-UI', function(message,data){
    console.log('Message received');
    //message received, could be used to build resource
});
