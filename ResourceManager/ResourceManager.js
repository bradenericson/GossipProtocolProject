/** TODO <-- this will need to be updated at the very end, I assume more variables will be added
 * Chad, Braden, Matt
 *
 *      Class Variables
 *          mainSpeaker
 *              messenger that speaks to main
 *          server
 *              messenger that listens on port 10002
 *          db
 *              TODO
 *
 *      Methods
 *           getFromDatabase(tags, callback)
 *              retrieve information from database based on the tags the user enters
 *
 *           getAll()
 *              TODO
 *
 *           indexResourceFiles()
 *              index each resource we do not have in the database
 *
 *           deleteResource(resourceName, callback)
 *              delete a resource from the database
 *
 *           addTags(resourceName, tags, callback)
 *              add tags to a resource in the databse
 *
 *           editDescription(resourceName, description, callback)
 *              edit a resource's description in the database
 *
 *           removeTags(resourceName, tags, callback)
 *              remove tags from a resource in the database
 *
 *           addResource(pathToNewResource, callback)
 *              add a resource to the database
 *
 *           editName(resourceName, newName, callback)
 *              edit the name of a resource in the database
 *
 *      Modification History
 *          Original Version
 *              April 23 2015
 */

var UDP = require("../UDP/UDPMessage.js");
var messenger = require("messenger");
var mongoose = require('mongoose');
var nodeMime = require('node-mime');
var ID = require('../UDP/ID/ID.js');
var IdFactory = require('../UDP/ID/IDFactory.js');
var mainSpeaker = messenger.createSpeaker(10000);//speaking to ResourceManager
var server = messenger.createListener(10002); //listens for messages on port 8000

var fs = require('fs');
var path = require('path');
var Mime = require('mime'); //used for indexing new files
var RESOURCE_PATH = __dirname + "/../resources/";
var badWords = ["the", "and", "a", "an", "on", "of", "from", "that", "this", "is", "really", "our"];

var idFactory = new IdFactory();

mongoose.connect('mongodb://localhost/gossip');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log('successful connection')
});

var stream;

var isFileDone = true;
var fileChunk;
var interval;

var packetsReceived = 0;

var Resource = require('./models/Resource/Resource.js');


indexResourceFiles();
//editDescription("test.txt", "Saturday morning finals are unethical and should be canceled", function(err, msg){
//   console.log(err, msg);
//});

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

//on meesasge parse it for keywords, get the resource from the database and swap the IDs
process.on('message', function (m) {
    //m = UDP obj

});

server.on('ui-resource-rename', function(message, data) {
    console.log("received data from Main to ResourceManager...", data);
    editName(data.oldResourceName, data.newResourceName, function(error, status) {
        message.reply(status);
    });
});

server.on('ui-resource-description', function(message, data) {
    console.log("received data from Main to ResourceManager...", data);
    editDescription(data.resourceName, data.description, function(error, status) {
        message.reply(status);
    });
});

server.on('ui-resource-add-tags', function(message, data) {
    addTags(data.resourceName, data.tagsToAdd, function(error, status) {
        message.reply(status);
    });
});

server.on('ui-resource-remove-tags', function(message, data) {
    removeTags(data.resourceName, data.tagsToRemove, function(error, status) {
        message.reply(status);
    });
});

//get resources from the database that contain the tags
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

//return all resources with tags
function getAll() {
  return Resource.find().exec(function(err, all){
      if(err){return err;}
      return all;
  });
}

//index resources we do not have
function indexResourceFiles(){
    console.log("in index resources files function");
    console.log(RESOURCE_PATH);
    fs.readdir(RESOURCE_PATH,function(err,files){
        console.log(err, files);
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
                                    size: size,
                                    gossipID: idFactory.idFactory().id
                                });
                            }
                        });
                        console.log("Indexed "+ file);
                    }

                }

            });
        });
    });
}

/*
    resourceName: the name of the file

    the deleteResource function deletes the file from mongo and the filesystem
*/

//delete a resource from the databse
function deleteResource(resourceName, callback){
    Resource.find({ name:resourceName }).remove(function(err){
        if(err){callback({error: err, msg: "trouble removing from mongodb"}, null);}
        else{
            fs.unlink(RESOURCE_PATH + resourceName, function(err){
                if(err){
                    callback({error: err, msg: "error trying to delete fill from filesystem"}, null);
                }else{
                      callback(null, "success");  //we're good
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

//add tags to a resource in the database
function addTags(resourceName, tags, callback){
    console.log("resourceName: ", resourceName);
    var query = Resource.find({name: resourceName}).limit(1);
    query.exec(function(err, resource){
        if(err){
            callback(err, null);
        }else{
            console.log("resource: ", resource);
            resource = resource[0];
            //var resourceTags = resource.tags;
            resource.tags = resource.tags.concat(tags);
            resource.markModified('tags');
            resource.save(function(){
              callback(null, "success");
            });
        }
    });
}

/*
    resourceName: the name of the file
    description: the String description that will be attached to the file's entry in mongo
 */

//edit the description of a resource in the database
function editDescription(resourceName, description, callback){
    var query = Resource.find({name: resourceName}).limit(1);
    query.exec(function(err, resource){
        if(err){callback(err)}else{
            resource = resource[0];
            resource.description = description;
            resource.save(function(err){
                callback(err, "success");
            });
        }
    });
}

/*
    resourceName: the name of the file
    tags: An Array of tags to remove from the list
 */

//remove tag(s) from a resource in the database
function removeTags(resourceName, tags, callback){
    var query = Resource.find({name: resourceName}).limit(1);
    query.exec(function(err, resource){
        if(err){
            callback(err, null)
        }else{
            resource = resource[0];
            var tempArray = resource.tags;
            for(var i=0;i<resource.tags.length;i++){
                if(resource.tags.indexOf(tags[i]) > -1){ //if a tag we're removing is in our resource array of tags
                    //remove that tag
                    resource.tags.splice(resource.tags.indexOf(tags[i]),1); //removes that tag from the array
                    i--;
                }
            }
            resource.markModified('tags');
            resource.save(function(err){
                if(err){
                    callback(err,null);
                }
                 else{
                    callback(null, "success");
                }

            })
        }


    });
}

/*
    pathToNewResource: The absolute path to the new file

    The addResource function takes a path to a resource and
    moves it to the /resource folder, and then indexes it into the database
 */

//add a resource to the database TODO
function addResource(pathToNewResource, callback){

}

/*
    resourceName: the name of the file
    newName: the name of the new file

    The editName function renames a file in mongo and the filesystem. It will also modfiy the mime/type to match the new type
 */

//edit the name of a resource in the database
function editName(resourceName, newName, callback){
    var query = Resource.find({name: resourceName}).limit(1);
    query.exec(function(error, resource) {
        if (error) {
            callback(error, null);
        }
        else {
            fs.rename(RESOURCE_PATH + resourceName, RESOURCE_PATH + newName, function(error) {
                if (error) { callback(error, null); }
                resource = resource[0];
                resource.name = newName;
                resource.save();//resource might be an array with one value in it. It is when I add the .limit to it at least... so usually I add resource = resource[0] when I know it's going to be one value back
                callback(null, "success");
            });
        }
    });

}

server.on('main-to-resourceManager', function(message,udpData){
    //this is for every packet that is not a response to something we asked for
    //we need to look at the request ID, see if we have the resource
    var udp = new UDP();
    //console.log("here i am: ", udpData);
    udp.createFromDatagramPacket(udpData);
    console.log("ID1: ", udp.getID1().id);
    console.log("ID2: ", udp.getID2().id);
    console.log("TTL: ", udp.getTimeToLive().get());
    console.log("MSG: ", udp.getMessage().toString());
    var doForward = true;
    //first we check and see if the packet TTL has expired
    if(typeof udp.getTimeToLive().get() === 'number' && udp.getTimeToLive().get() > 0){
        if(udp.getTimeToLive().get() === 0){
            //make sure we don't forward dead packets
            doForward = false;
        }else{
            udp.getTimeToLive().decrement();
        }

        /*
            isValidResource(udp.getID2().id, function(err, obj))
            if(udp.getID2().id)
        */


        var msg = udp.getMessage().toString();

        var tags = msg.split(" ");

        for (var i = 0; i < tags.length; i++) {
            for (var y = 0; y < badWords.length; y++) {
                if (tags[i] === badWords[y]) {
                    tags.splice(i,1);
                }
            }
        }
        getFromDatabase(tags, function(err, data){
            if(err){
                console.error(err);
                console.log("BUT WE'RE STILL SENDING THE ORIGINAL PACKET FORWARD");
            }
            else{
                var UdpCopy;
                var string;
                for(var i=0; i < data.length; i++) {
                    //copy ID
                    udpCopy = udp;
                    string = "|"+data[i].mimeType+"|"+data[i].size+"|"+data[i].description;
                    udpCopy.createForFindResponse(data[i].gossipID,5,string);

                    mainSpeaker.request('resourceManager-to-main', udpCopy.createUdpPacket(), function(){
                       //we don't care
                    });
                    //resourceID is 12 bytes long
                    //put data[i]
                    //create byte array, put info in it,
                    // setMessage() *new function*
                    //end of loop send new UDP to main
                    //braden will add sending to main
                }
            }
            if(doForward){
                mainSpeaker.request('resourceManager-to-main', udp.createUdpPacket(), function(){
                    //we don't care
                });
            }

            //forward on original packet
        })







    }
    console.log('Message received');
    //message received, could be used to build resource
});


server.on('main-to-resourceManager-build', function(message,udpData){
    //at this point, we know that it's a response to something we're building
    var udp = new UDP().createForGetResponse(udpData);


    console.log('Message received');
    //message received, could be used to build resource
});

server.on('main-to-resourceManager-build', function(message, resourcePart) {
    //add whatever resourcePart is to fileChunk
    if (fileChunk !== null) {
        fileChunk.concat(resourcePart);
    }
    else {
        fileChunk = resourcePart;
    }

    packetsReceived++;
});

server.on('start-stream', function(message, data) {

    var numFileParts = Math.ceil(data.resourceSize / 456);
    var fileExtension = mimeType.extension(data.mimeType);

    data.targetResourceName = data.targetResourceName.substring(0, data.targetResourceName.indexOf(".")); //get rid of any supplied extensions from the user
    console.log("Beginning to write file named: " + data.targetResourceName + "." + fileExtension);

    if (stream === null) {
        if (resourceFromCollection != null) {
            stream = fs.createWriteStream("resources/" + data.targetResourceName + "." + fileExtension);
            stream.once('open', function(fd) {
                isFileDone = false;
                interval = setInterval(function() {
                    if (fileChunk !== null) {
                        stream.write(fileChunk);

                        if (packetsReceived == numFileParts) {
                            isFileDone = true;
                        }

                        fileChunk = null;
                    }

                    if (isFileDone) {

                        stream.end(); //close the stream
                        clearInterval(interval);
                        fileChunk = null;
                    }
                }, 1000);
            });
            message.reply("success");
        }
        else {
            message.reply("resourceId wasn't a valid ID");
            stream.end();
            clearInterval(interval);
        }
    }
    else {
        message.reply("stream is already open");
    }
});
