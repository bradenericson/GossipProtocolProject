/**
 *      Chad, Braden, Matt
 *
 *      Class Variables
 *
 *
 *
 */

var DatagramSender = require('./DatagramSenderReceiver/DatagramSender.js');
var DatagramReceiver = require('./DatagramSenderReceiver/DatagramReceiver.js');
var PacketQueue = require('./Queue/DatagramQueue.js');
var DatagramSocket = require('./DatagramSenderReceiver/DatagramSocket.js');
var AddressBook = require('./DatagramSenderReceiver/AddressBook.js');
var messenger = require('messenger');
var mainSpeaker = messenger.createSpeaker(10000);
var server = messenger.createListener(10001);

//////////
var portNumber = 12345;
var packetSize = 32;
var incomingPacketQueue = new PacketQueue();
var outgoingPacketQueue = new PacketQueue();
var datagramSocket = new DatagramSocket();
var addressBook = new AddressBook();
var receiver = new DatagramReceiver(datagramSocket, incomingPacketQueue, packetSize);
var sender = new DatagramSender(datagramSocket, outgoingPacketQueue, packetSize, addressBook);

//receiver.action();
//console.log('before receiver start');
receiver.start();
//console.log('before sender start');
sender.start();

server.on('main-to-transceiver', function (message, messageToSend) {
    //console.log("messageToSend UDPMessage: ", messageToSend);
    //outgoingPacketQueue.add(messageToSend);

    outgoingPacketQueue.add(messageToSend);
    message.reply("success");
});


//not sure if this should be here, but couldn't figure out a cleaner way to do it.
var interval = setInterval(function(){
    var udp = receiver.action();
    if(udp){
        mainSpeaker.request('transceiver-to-main', udp, function(data){
            //console.log('message received by main');
        });
    }

},2000);



