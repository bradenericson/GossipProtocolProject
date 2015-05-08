/** Created by matt on 4/23/15. */

var ID = require("./ID/ID.js");
var TTL = require("./TimeToLive.js");

/** need to figure out multiple constructors */
module.exports = function() {

    var id1;
    var id2;
    var timeToLive;
    var message;
    var packetSize = 456;

    var self = {};
    self.createFromDatagramPacket = function(datagramPacket_in) {
        if (typeof datagramPacket_in != "undefined") {
            id1 = new ID(datagramPacket_in.toString("utf8", 0, 15));
            id2 = new ID(datagramPacket_in.toString("utf8", 16, 31));
            timeToLive = new TTL(datagramPacket_in.toString("utf8", 32, 35));
            message = datagramPacket_in.toString("utf8", 36, datagramPacket_in.length);
        }
        else {
            throw new Error("The UDP message class did not receive a datagram");
        }
    };

    self.createForFindRequest = function(id1, id2, ttl, message){

    }

    self.createForGetRequest = function(id1, id2, ttl, byte) {

    }
    self.getDatagramPacket = function() {
        return datagramPacket_in;
    };

    //self.getDatagramPacket = function(payload_string) {} implement these if needed
    //self.getDatagramPacket = function(payload_byte) {}

    self.getID1 = function() {
        return id1;
    };

    self.getID2 = function() {
        return id2;
    };

    self.getTimeToLive = function() {
        return timeToLive;
    };

    self.getMessage = function() {
        return message;
    };

    self.swapID = function() {
        var hold;
        hold = id1;
        id1 = id2;
        id2 = hold;
    };

    self.setMessage = function(byteArray) {
        message = byteArray;
    };

    self.setID = function(input) {

        //input should ONLY BE 12 LENGTH from Resource Manager + MongoDB. Tack LMAO onto the end

        input += "LMAO";

        var bytes = [];

        for (var i = 0; i < input.length; ++i)
        {
            bytes.push(input.charCodeAt(i));
        }

        id1 = new ID(bytes);
    };

    self.getMaximumPacketSizeInBytes = function() {
        return packetSize;
    };

    self.getMinimumPacketSizeInBytes = function() {
        return packetSize;
    };

    return self;
};
