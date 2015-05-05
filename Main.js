/**
 * Created by Chad Luangrath on 4/28/2015.
 */

var datagramPacket = require('dgram');

var timeToLive = require('./DatagramSenderReceiver/UDP/TimeToLive.js');
var udpMessage = require('./DatagramSenderReceiver/UDP/UDPMessage.js');
var idFactory = require('./DatagramSenderReceiver/UDP/ID/IDFactory.js');


var _idFactory = new idFactory();

process.on('message', function(m) {
    if (m === "join") {
        console.log("Creating the join datagram packet");

        var newBuffer = new Buffer(_idFactory.idFactory());
        //newBuffer.concat(_idFactory.getZeroID());
        //newBuffer.concat(new timeToLive(0));

        var joinMessage = new udpMessage(newBuffer);
        process.send({message: "hello dad"});

    }
});

//process.send({ foo: 'bar' });