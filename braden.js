/**
 * Created by braden on 4/23/15.
 */

var DatagramSender = require('./DatagramSenderReceiver/DatagramSender.js');
var DatagramReceiver = require('./DatagramSenderReceiver/DatagramReceiver.js');
var PacketQueue = require('./Queue/DatagramQueue.js');
var DatagramSocket = require('./DatagramSenderReceiver/DatagramSocket.js');
/*
Testing purposes
 */
var idFactory = require("./DatagramSenderReceiver/UDP/ID/IDFactory.js");



//////////
var portNumber = 12345;
var packetSize = 32;
var incomingPacketQueue = new PacketQueue();
var outgoingPacketQueue = new PacketQueue();
var datagramSocket = new DatagramSocket();
var receiver = new DatagramReceiver(datagramSocket, incomingPacketQueue, packetSize);
var sender = new DatagramSender(datagramSocket, outgoingPacketQueue, packetSize);

//receiver.action();

receiver.start();

sender.start();
var factory = new idFactory();
var byteArray = factory.idFactory();
var byteArray2 = factory.idFactory();
byteArray = byteArray.concat(byteArray2);
var buffer = new Buffer(byteArray);
setTimeout(function(){
    //outgoingPacketQueue.add();
    outgoingPacketQueue.add(buffer);
},2000);
//sender.run();