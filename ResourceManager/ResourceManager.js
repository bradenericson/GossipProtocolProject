/**
 * Created by braden on 4/23/15.
 */

var UDP = require("../DatagramSenderReceiver/UDP/UDPMessage.js");
var messenger = require("messenger");
var mongoose = require('mongoose');

mainSpeaker = messenger.createSpeaker(8000);//speaking to ResourceManager
server = messenger.createListener(8002); //listens for messages on port 8000

mongoose.connect('mongodb://localhost/gossip');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log('successful connection')
});

var Resource = require('./models/Resource/Resource.js');

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
}



