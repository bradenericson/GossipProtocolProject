/**
 * Created by braden on 4/23/15.
 */

var UDP = require("../DatagramSenderReceiver/UDP/UDPMessage.js");
var messenger = require("messenger");
var mongoose = require('mongoose');

 mainSpeaker = messenger.createSpeaker(10000);//speaking to ResourceManager
 server = messenger.createListener(10002); //listens for messages on port 8000
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var Mime = require('mime'); //used for indexing new files
var RESOURCE_PATH = __dirname + "/../resources/";


mongoose.connect('mongodb://localhost/gossip');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log('successful connection')
});

var Resource = require('./models/Resource/Resource.js');

indexResourceFiles();
//deleteResource("test.txt");
//Generates bogus data
/*
for(var i = 0; i < 10; i++) {
    Resource.create({
        name: "Test " + i,
        description: "Test Description " + i,
        tags: ["test", "cat", "dog", "water", "fire", "earth", "air", "all", "changed", "when", "fire", "nation", "attacked"],
        location: "C://",
        mimeType: "image/jpeg",
        size: 1024
    });

    console.log("Created Test " + i + " in the database!");
};
*/

process.on('message', function (m) {
    //m = UDP obj
    var msg = m.getMessage();
    var tags = msg.split(" ");
    var badWords = ["the", "and", "a", "an", "on", "of", "from", "that", "this", "is", "really", "our"];
    var i;
    var y;
    for (i = 0; i < tags.length; i++) {
        for (y = 0; y < badWords.length; y++) {
            if (tags[i] === badWords[y]) {
                tags.splice(i);
            }
        }
    }
    getFromDatabase(tags, function(err, data){
        if(err){console.error(err);}
        else{
            for(var i=0; i < data.length; i++) {
                //flip IDs
                var UDPmsg = m;
                UDPmsg.swapID();
                var message = new Buffer(UDPmsg.getMaximumPacketSizeInBytes());
                messasge.write();


                //resourceID is 12 bytes long
                //put data[i]
                //create byte array, put info in it,
                // setMessage() *new function*
                //end of loop send new UDP to main
                //braden will add sending to main

            }

        }
    })
});

function getFromDatabase(tags, callback) {
  //mongo code

Resource.find({
        'tags': { $in: tags}
    }, function(err, docs){
        if(err)
        {
            callback(err, []);
        }
        callback(null, docs);
    });
    //callback(null, [{_id: "23958203948", mimeType: "type/text", location: "/resources/file.txt", description: "This is a description for our really cool file.", size: 1024, fileName: "file.txt"}]);
};

function getAll() {
  return Resource.find().exec(function(err, all){
      if(err){return err;}
      return all;
  });
}

function indexResourceFiles(){
    console.log("hello");
    fs.readdir(RESOURCE_PATH,function(err,files){
        if(err){ throw err}

        files.forEach(function(file){
            // do something with each file HERE!
            Resource.where('name').equals(file).limit(1).exec(function(err, resource){
                if(err){
                    throw err;
                }
                else{
                    if(resource.length === 0){
                        //file does not exist, so we must index it
                        fs.stat(RESOURCE_PATH +file, function(error, stats) {
                            if(error){console.log(error);}else{
                                var mime = Mime.lookup(file);
                                var size = stats.size;
                                console.log(stats);
                                Resource.create({
                                    name: file,
                                    description: "",
                                    tags: [""],
                                    location: file,
                                    mimeType: mime,
                                    size: size
                                });
                            }
                        });
                        console.log("Indexed "+ file);
                    }
                  console.log(file + " is already indexed");
                }

            });
        });
    });
}

/*
    resourceName: the name of the file

    the deleteResource function deletes the file from mongo and the filesystem
 */
function deleteResource(resourceName){
    Resource.find({ name:resourceName }).remove(function(err){
        if(err){return {error: err, msg: "trouble removing from mongodb"};}
        else{
            fs.unlink(RESOURCE_PATH + resourceName, function(err){
                if(err){
                    return {error: err, msg: "error trying to delete fill from filesystem"};
                }else{
                    return {error: null, msg: "success"}; //we're good
                }
            });
        }
    });
}


/*
    resourceName: the name of the file
    tag: an array containing the new tags

    the addTags function takes an array of tags, and adds them to the array of tags stored in Mongo
 */
function addTags(resourceName, tags){

}

/*
    resourceName: the name of the file
    description: the String description that will be attached to the file's entry in mongo
 */
function editDescription(resourceName, description){

}

/*
    resourceName: the name of the file
    tags: An Array of tags to remove from the list
 */
function removeTags(resourceName, tags){

}

/*
    pathToNewResource: The absolute path to the new file

    The addResource function takes a path to a resource and
    moves it to the /resource folder, and then indexes it into the database
 */
function addResource(pathToNewResource){

}

/*
    resourceName: the name of the file
    newName: the name of the new file

    The editName function renames a file in mongo and the filesystem. It will also modfiy the mime/type to match the new type
 */
function editName(resourceName, newName){

}








