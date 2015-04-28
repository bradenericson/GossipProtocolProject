/** Created by matt on 4/23/15. */

/** need to figure out multiple constructors */
module.exports = function(datagramPacket_in) {

    var id1;
    var id2;
    var timeToLive;
    var message;
    var packetSize = 476;

    var self = {};

    if (typeof datagramPacket_in != "undefined") {
        id1 = datagramPacket_in.toString("utf8", 0, 15);
        id2 = datagramPacket_in.toString("utf8", 16, 31);
        timeToLive = datagramPacket_in.toString("utf8", 32, 35);
        message = datagramPacket_in.toString("utf8", 36, datagramPacket_in.length);
    }
    else {
        throw new Error("The UDP message class did not receive a datagram");
    }

    self.getDatagramPacket = function() {
        return datagramPacket_in;
    };

    //self.getDatagramPacket = function(payload_string) {} implement these if needed
    //self.getDatagramPacket = function(payload_byte) {}

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

    self.getMaximumPacketSizeInBytes = function() {
        return packetSize;
    }

    self.getMinimumPacketSizeInBytes = function() {
        return packetSize;
    }

    return self;
};
