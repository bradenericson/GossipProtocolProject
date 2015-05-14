/**
 * Created by braden on 5/7/15.
 */

var DatagramSender = require('./DatagramSenderReceiver/DatagramSender.js');
var DatagramReceiver = require('./DatagramSenderReceiver/DatagramReceiver.js');
var PacketQueue = require('./Queue/DatagramQueue.js');
var DatagramSocket = require('./DatagramSenderReceiver/DatagramSocket.js');
var messenger = require('messenger');
client = messenger.createSpeaker(8000);
server = messenger.createListener(8001);

//////////
var portNumber = 12345;
var packetSize = 32;
var incomingPacketQueue = new PacketQueue();
var outgoingPacketQueue = new PacketQueue();
var datagramSocket = new DatagramSocket();
var receiver = new DatagramReceiver(datagramSocket, incomingPacketQueue, packetSize);
var sender = new DatagramSender(datagramSocket, outgoingPacketQueue, packetSize);

//receiver.action();
//console.log('before receiver start');
receiver.start();
//console.log('before sender start');
sender.start();

server.on('main-to-transceiver', function (messageToSend) {
    outgoingPacketQueue.add(messageToSend);
});

incomingPacketQueue.add({udp: "new udp"});

var interval = setInterval(function(){
    var udp = receiver.action();
    if(udp){
        client.request('transceiver-to-main', udp, function(data){
            //console.log('message received by main');
        });
    }

},2000);



