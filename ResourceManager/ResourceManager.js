/**
 * Created by braden on 4/23/15.
 */

var UDP = require("../DatagramSenderReceiver/UDP/UDPMessage.js");
mainSpeaker = messenger.createSpeaker(8000);//speaking to ResourceManager
server = messenger.createListener(8002); //listens for messages on port 8000
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gossip');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log('successful connection')
});

var Resource = require('./models/Resource/Resource.js');

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
    callback(null, [{_id: "23958203948", mimeType: "type/text", location: "/resources/file.txt", description: "This is a description for our really cool file.", size: 1024, fileName: "file.txt"}]);
}



