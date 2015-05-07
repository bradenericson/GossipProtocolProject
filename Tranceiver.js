/**
 * Created by braden on 5/7/15.
 */

var DatagramSender = require('./DatagramSenderReceiver/DatagramSender.js');
var DatagramReceiver = require('./DatagramSenderReceiver/DatagramReceiver.js');
var PacketQueue = require('./Queue/DatagramQueue.js');
var DatagramSocket = require('./DatagramSenderReceiver/DatagramSocket.js');
var messenger = require('messenger');
client = messenger.createSpeaker(8000);
server = messenger.createListener(8000);

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

server.on('tranceiver', function (messageToSend) {
    outgoingPacketQueue.add(messageToSend);
});



var interval = setInterval(function(){

},2000);
