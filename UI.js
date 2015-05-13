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
        text !== 'resources') {
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
    if (text === 'resources') {
        console.log("in the resources handler");
        console.log("there are " + resources.length + " records in my database collection");
        for(var i = 0; i < resources.length; i++) {
            console.log(resources[i].name);
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
    console.log("resources | Show my resources");
    console.log("join | Join the P2P network");
    console.log("quit | Quit the P2P network");
    console.log("help | See a list of available commands");
}