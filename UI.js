/**
 * Created by Chad Luangrath on 4/28/2015.
 */

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');
var main = require("./Main.js");
var childProcess = require("child_process");
var config = require('./Config.js');
var Resource = require('./ResourceManager/models/Resource/Resource.js');
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');

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

    //spinner.start();

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

        var searchPhrase = text.substring(text.indexOf('--') + 2, text.length - 1);
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
        var mainProcess = childProcess.fork(__dirname + "/Main.js");
        mainProcess.send("join");
        mainProcess.on("message", function(m){
            console.log(m);
        });
    }
    if (text.indexOf("resource") >= 0) {
        if (text.indexOf("show") >= 0) {
            console.log("I have " + resources.length + " resources in my collection!");
            //spinner.start();
            console.log("\n");

            for(var i = 0; i < resources.length; i++) {
                var resourceDetailString = resources[i].name + " | " + resources[i].description + " | tags: ";

                for(var j = 0; j < resources[i].tags.length; j++) {
                    resourceDetailString += resources[i].tags[j] + " ";
                }

                console.log(resourceDetailString);
            }
        }
        else if (text.indexOf("rename") >= 0) {
            console.log("renaming resource");
        }
        else if (text.indexOf("description") >= 0) {
            console.log("changing description");
        }
        else if (text.indexOf("tags add") >= 0) {
            console.log("adding tags");
        }
        else if (text.indexOf("tags remove") >= 0) {
            console.log("removing tags");
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
}

function requestResource(resourceName) {
    console.log("you requested " + resourceName);
}

function help() {
    console.log("search --searchPhrase | Search for resources using the searchPhrase");
    console.log("request --resourceName | Request a resource by the resource name");
    console.log("resource show | Show and manage my resources");
    console.log("resource rename --resourceName --newResourceName | Rename one of your resources");
    console.log("resource description --resourceName --newDescription | Change the description of --resourceName");
    console.log("resource tags add --resourceName --tag1, tag2, tag3, tag4 | Add new tags to --resourceName");
    console.log("resource tags remove --resourceName --tag1, tag2, tag3, tag4 | Remove tags from --resourceName");
    console.log("join | Join the P2P network");
    console.log("quit | Quit the P2P network");
    console.log("help | See a list of available commands");
}