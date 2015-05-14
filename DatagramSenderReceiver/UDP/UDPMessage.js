/** Created by matt on 4/23/15.
 *
 *      Class Variables:
 *          id1
 *              first id of a udp message
 *          id2
 *              second id of the udp message
 *          timeToLive
 *              time to live part of the udp message, hop count
 *          message
 *              message part of udp message contains various info
 *          packetSize
 *              maximum size of packets
 *
 *      Method:
 *          self.createFromDatagramPacket = function(datagramPacket_in)
 *              create a UDP message from a datagram packet
 *
 *          self.createForFindRequest = function(id1, id2, ttl, message)
 *              //TODO
 *
 *          self.createForGetRequest = function(id1, id2, ttl, byte)
 *              //TODO
 *
 *          self.getDatagramPacket = function()
 *              return the datagram packet
 *
 *          self.getID1 = function()
 *              return id1 of udp message
 *
 *          self.getID2 = function()
 *              return id2 of udp message
 *
 *          self.getTimeToLive = function()
 *              return ttl of message
 *
 *          self.getMessage = function()
 *              return the message of the udp message
 *
 *          self.swapID = function()
 *              swaps the ids
 *
 *          self.setMessage = function(byteArray)
 *              set the message part of the udp message
 *
 *          self.setID = function(input)
 *
 *          self.getMaximumPacketSizeInBytes = function()
 *              return maximum packet size
 *
 *          self.getMinimumPacketSizeInBytes = function()
 *              return minimum packet size ... same as max for right now
 *
 * */

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

    //create a UDP message from a datagram packet
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
    //TODO
    self.createForFindRequest = function(id1, id2, ttl, message){

    }

    //TODO
    self.createForGetRequest = function(id1, id2, ttl, byte) {

    }

    //return the datagram packet
    self.getDatagramPacket = function() {
        return datagramPacket_in;
    };

    //self.getDatagramPacket = function(payload_string) {} implement these if needed
    //self.getDatagramPacket = function(payload_byte) {}

    //return id1
    self.getID1 = function() {
        return id1;
    };

    //return id2
    self.getID2 = function() {
        return id2;
    };

    //return ttl of message
    self.getTimeToLive = function() {
        return timeToLive;
    };

    //return the message of the udp message
    self.getMessage = function() {
        return message;
    };

    //swap the ids
    self.swapID = function() {
        var hold;
        hold = id1;
        id1 = id2;
        id2 = hold;
    };

    //set the message part of the udp message
    self.setMessage = function(byteArray) {
        message = byteArray;
    };

    //TODO
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

    //return the maximum packet size
    self.getMaximumPacketSizeInBytes = function() {
        return packetSize;
    };

    //return minimum packet size ... same as max for right now
    self.getMinimumPacketSizeInBytes = function() {
        return packetSize;
    };

    return self;
};
