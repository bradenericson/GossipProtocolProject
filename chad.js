/**
 * Created by braden on 4/23/15.
 */
//var IDFactory = require('./DatagramSenderReceiver/UDP/ID/IDFactory.js');
//
//var test = new IDFactory();
//var idFactory = new IDFactory();
//
//idFactory.generateId();
//var newId = idFactory.idFactory();
//
//console.log(newId.id);

/// <reference path="typings/node/node.d.ts"/>

var datagramPacket = require('dgram');

var socket = datagramPacket.createSocket('udp4');

socket.on("error", function (err) {
  console.log("socket error:\n" + err.stack);
  socket.close();
});

socket.on('listening', function () {
    var address = socket.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    socket.setBroadcast(true)
    socket.setMulticastTTL(128);
    socket.addMembership('224.1.1.1');
});

socket.on('message', function (message, rinfo) {
    //console.log("Received a message!");
    console.log('Received %d bytes from %s:%d\n',
        message.length, rinfo.address, rinfo.port);
    console.log("The message is: ", message.toString());
});

socket.bind(7000);

//process.send({ foo: 'bar' });