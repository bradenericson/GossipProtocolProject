/** Created by matt on 4/23/15. */

/** need to figure out multiple constructors */
module.exports = function(id1_in, id2_in, timeToLive_in, message_in, datagramPacket_in) {

    var id1;
    var id2;
    var timeToLive;
    var message;

    var self = {};

    if (typeof id1_in != "undefined" && id2_in != "undefined" && timeToLive_in != "undefined" && message_in != "undefined" {
        id1 = id1_in;
        id2 = id2_in;
        timeToLive = timeToLive_in;
        message = message_in;
    }
    else if (typeof datagramPacket_in != "undefined") {

    }

    self.getDatagramPacket = function() {
        return datagramPacket_in;
    };

    self.getDatagramPacket = function(payload) {

    }

    self.getDatagramPacket = function(byte[]) {

    }

    self.getID1 = function() {
        return id1;
    }

    self.getID2 = function() {
        return id2;
    }

    self.getTimeToLive = function() {
        return timeToLive;
    }

    self.getMessage = function() {
        return message;
    }

    return self;
};
