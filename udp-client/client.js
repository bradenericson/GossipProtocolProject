var dgram = require('dgram');
var IDFactory = require('../UDP/ID/IDFactory');

var client = dgram.createSocket("udp4");

var StringDecoder = require('string_decoder').StringDecoder;



var idFactory = new IDFactory();

var id1 = idFactory.idFactory();
var id2 = idFactory.idFactory();

console.log("id1 id: ", id1.id);
console.log("id2 id: ", id2.id);

//var superMegaId = id1.id.concat(id2.id);

//var id1Cutout = superMegaId.slice(0, 16);
//var id2Cutout = superMegaId.slice(17, 32);
//
//console.log("id1Cutout: ", id1Cutout);
//console.log("id2Cutout: ", id2Cutout);
//
//console.log("superMegaId: ", superMegaId);

var id1 = new Buffer(id1.id, 'utf8');
var id2 = new Buffer(id2.id, 'utf8');

var x = 5;
var byteArray = new Array(4);
var timeToLive = Math.floor(x);

for(var i = byteArray.length - 1; i >= 0; i--) {
    byteArray[i] = timeToLive % 256;
    timeToLive = Math.floor(x/256);
};

console.log("ttl byteArray: ", byteArray);

var ttl = new Buffer(byteArray, 'utf8');

console.log("ttl: ", ttl);

var randomId = idFactory.idFactory();
var randomIdBuffer = new Buffer(randomId.id, 'utf8');

var message = new Buffer("|image/jpeg|1002092|super cute cats all over Braden", 'utf8');

//console.log("randomId: ", randomId.id);

var udpPacket = Buffer.concat([id1, id2, ttl, randomIdBuffer, message]);

//console.log("ttl: ", ttl.toString('utf8'));

//console.log("udpPacket: ", udpPacket);

client.send(udpPacket, 0, udpPacket.length, 12345, "10.20.51.220", function(err) {
    client.close();
});

//
//var testBuffer = new Buffer("test string");
//
//var fs = require('fs');
//var stream = fs.createWriteStream("resources/my_file.txt");
//stream.once('open', function(fd) {
//    while (resource != complete) {
//        stream.write(testBuffer);
//        stream.end();
//    }
//
//});