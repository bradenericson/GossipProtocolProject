/**
 * Created by braden on 4/23/15.
 */

var UDP = require("../DatagramSenderReceiver/UDP/UDPMessage.js");

process.on('message', function (m) {
    var msg = m.getMessage();
    var tags = msg.split(" ");
    var badWords = ["the", "and", "a", "an", "on", "of", "from", "that"];
    var i;
    var y;
    for (i = 0; i < tags.length; i++) {
        for (y = 0; y < badWords.length; y++) {
            if (tags[i] === badWords[y]) {
                tags.splice(i);
            }
        }
    }
};

function getFromDatabase(callback) {
  //mongo code
};



