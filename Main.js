/// <reference path="typings/node/node.d.ts"/>
/**
 * Created by Chad Luangrath on 4/28/2015.
 */

var datagramPacket = require('dgram');
var messenger = require('messenger');
transceiverChild = messenger.createSpeaker(8001);
server = messenger.createListener(8000);
var childProcess = require("child_process");


var timeToLive = require('./DatagramSenderReceiver/UDP/TimeToLive.js');
var udpMessage = require('./DatagramSenderReceiver/UDP/UDPMessage.js');
var idFactory = require('./DatagramSenderReceiver/UDP/ID/IDFactory.js');


var _idFactory = new idFactory();


childProcess.fork(__dirname + "/Transceiver.js");

process.on('message', function (m) {
    if (m === "join") {
        //Joiner multicasts the UDP Message to everyone
        console.log("Creating the join datagram packet");

        var socket = datagramPacket.createSocket('udp4');

        socket.bind(null, null, function() {
            socket.setBroadcast(true);
            socket.setMulticastTTL(128);
        });

        var newBuffer = new Buffer(_idFactory.idFactory());
        var zeroIdBuffer = new Buffer(_idFactory.getZeroID());
        var ttlBuffer = new Buffer(new timeToLive(0));

        var testBuffer = new Buffer("message");

        var completedBuffer = Buffer.concat([newBuffer, zeroIdBuffer, ttlBuffer]);
        console.log("completedBuffer: " + completedBuffer);

        socket.send(testBuffer, 0, testBuffer.length, 7000, '224.1.1.1', function () {
            console.log("Multicasted the join message to 224.1.1.1:5007!");
        });
        //process.send({message: "hello dad"});

    }
});

server.on('transceiver-to-main', function(message, data){
   //data = UDP message
    console.log("got UDP message");
    //code that handles what to do with the packet
        //could be a response to one of our packets
        //could be a dead packet
        //could be a packet we need to send on
        //could be a resource that is being built
});



//process.send({ foo: 'bar' });