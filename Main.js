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
        //Joiner multicasts the UDP Message to everyone
        console.log("Creating the join datagram packet");

        var socket = datagramPacket.createSocket('udp4');
        socket.bind(11111, function() {
            socket.setBroadcast(true);
            //socket.setMulticastTTL(128);
        });

        var newBuffer = new Buffer(_idFactory.idFactory());
        var zeroIdBuffer = new Buffer(_idFactory.getZeroID());
        var ttlBuffer = new Buffer(new timeToLive(0));

        var testBuffer = new Buffer("asiuodfjaosidfjasoiufj");

        var completedBuffer = Buffer.concat([newBuffer, zeroIdBuffer, ttlBuffer]);
        console.log("completedBuffer: " + completedBuffer);

        socket.send(testBuffer, 0, testBuffer.length, 11111, '239.255.255.255', function() {
            console.log("multicasted the join message");
        });
        //process.send({message: "hello dad"});

    }
});

//process.send({ foo: 'bar' });