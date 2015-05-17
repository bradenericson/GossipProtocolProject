/**
 *      Braden, Chad, Matt
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
var BufferReader = require('buffer-reader');
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
            datagramPacket_in = datagramPacket_in.data;

            //console.log("datagramPacket_in is buffer? ", Buffer.isBuffer(buffer));

            id1 = new ID(datagramPacket_in.splice(0,16));
            id2 = new ID(datagramPacket_in.splice(0,16));

            //console.log(buffer);
            //id1 = new ID(reader.nextString(16));
            //id2 = new ID(reader.nextString(16));
           // console.log("the packet before TTL splice: ",datagramPacket_in.splice(0,4));
            timeToLive = new TTL(convertByteArraytoInteger(datagramPacket_in.splice(0,4)));
            var id3 = datagramPacket_in.splice(0,16); //garbage ID
            //console.log("ID3: ",id3);
            //ignore the next 16 bytes because it's just extra padding (a random ID)
            message = new Buffer(datagramPacket_in).toString("utf8", 0, datagramPacket_in.length);
        }
        else {
            throw new Error("The UDP message class did not receive a datagram");
        }
    };

    //TODO
    self.createForFindRequest = function(id1, id2, ttl, message){
        self.setId1(id1);
        self.setId2(id2);
        self.setTimeToLive(ttl);
        self.setMessage(convertStringToByteArray(message));

        return self;
    };

    //TODO
    self.createForGetRequest = function(id1, id2, ttl, byte) {
        self.setId1(id1);
        self.setId2(id2);
        self.setTimeToLive(ttl);
        self.setMessage(byte);
    };

    self.createForGetResponse = function(datagramPacket_in) {
        if (typeof datagramPacket_in != "undefined") {
            datagramPacket_in = datagramPacket_in.data;

            id1 = new ID(datagramPacket_in.splice(0,16));
            id2 = new ID(datagramPacket_in.splice(0,16));
            timeToLive = new TTL(convertByteArraytoInteger(datagramPacket_in.splice(0,4)));

            //ignore the next 16 bytes because it's just extra padding (a random ID)
            var id3 = datagramPacket_in.splice(0,16); //garbage ID
            var partNumber = convertByteArraytoInteger(datagramPacket_in.splice(0,4));

            self.partNumber = partNumber;

            message = new Buffer(datagramPacket_in).toString("utf8", 0, datagramPacket_in.length);
        }
        else {
            throw new Error("The UDP message class did not receive a datagram");
        }
    };

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

    self.setId1 = function(idToSet) {
        id1 = idToSet;
    };

    self.setId2 = function(idToSet) {
        id2 = idToSet;
    };

    self.setTimeToLive = function(ttlToSet) {
        timeToLive = ttlToSet;
    };

    //return the maximum packet size
    self.getMaximumPacketSizeInBytes = function() {
        return packetSize;
    };

    //return minimum packet size ... same as max for right now
    self.getMinimumPacketSizeInBytes = function() {
        return packetSize;
    };

    self.createUdpPacket = function() {

        var id1Buffer = new Buffer(self.getID1()); //we need to keep track of this ID because it is our Request ID
        var id2Buffer = new Buffer(self.getID2());
        var timeToLiveBuffer = new Buffer(self.getTimeToLive().get());
        var messageBuffer = new Buffer(self.getMessage());

        var udpPacket = Buffer.concat([id1Buffer, id2Buffer, timeToLiveBuffer, messageBuffer]);

        return udpPacket;
    };

    return self;
};

function convertStringToByteArray(stringToConvert) {
    var bytes = [];

    for (var i = 0; i < stringToConvert.length; ++i) {
        bytes.push(stringToConvert.charCodeAt(i));
    }

    return bytes;
};

function convertByteArraytoInteger(byteArray) {
    var x = 0;
    console.log("array coming into function: ",byteArray);
    for(var i = 0; i < byteArray.length; i++) {
        x = x << 8;
        x = x | (byteArray[i] & 0xff);
    }

    console.log("returning from function: ", x);
    return x;
}

function convertIntegerToByteArray(integer) {

    var byteArray = new Array(4);
    var timeToLive = Math.floor(integer);

    for(var i = byteArray.length - 1; i >= 0; i--) {
        byteArray[i] = timeToLive % 256;
        timeToLive = Math.floor(integer/256);
    }

    return byteArray;
}