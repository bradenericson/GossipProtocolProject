/**
 *      Chad, Braden, Matt
 *
 *      Class Variables
 *          portNumber
 *              port number being used
 *          packetSize
 *              TODO why 32?
 *          incomingPacketQueue
 *              new queue for incoming packets
 *          outgoingPacketQueue
 *              new queue for packets being sent
 *          datagramSocket
 *              new socket connection
 *          addressBook
 *              queue for addresses
 *          receiver
 *              new datagramReceiver object
 *          sender
 *              new datagramSender object
 *
 *      Methods:
 *          server.on('main-to-transceiver', function (message, messageToSend)
 *              listening for messages coming from main
 *          var interval = setInterval(function()
 *              send a message to main if the we recieve a message, run every 2 seconds
 *          process.on('exit',function()
 *              on exit, kill sender and receiver process
 *
 *      Modification History
 *          Original Version
 *              April 23 2015
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

//addressBook.addAddress("10.20.51.220"); //Braden
//addressBook.addAddress("10.20.51.44"); //Chad
addressBook.addAddress("140.209.121.104"); //Jarvis

var receiver = new DatagramReceiver(datagramSocket, incomingPacketQueue, packetSize);
var sender = new DatagramSender(datagramSocket, outgoingPacketQueue, packetSize, addressBook);

//receiver.action();
//console.log('before receiver start');
receiver.start();
//console.log('before sender start');
sender.start();

//listening for messages coming from main
server.on('main-to-transceiver', function (message, messageToSend) {
    //console.log("messageToSend UDPMessage: ", messageToSend);
    //outgoingPacketQueue.add(messageToSend);
    outgoingPacketQueue.add(messageToSend);
    message.reply("success");
});


//send a message to main if the we recieve a message, run every 2 seconds
var interval = setInterval(function(){
    var udp = receiver.action();
    if(udp){
        mainSpeaker.request('transceiver-to-main', udp, function(data){
            //console.log('message received by main');
        });
    }

}, 2);

//on exit, kill sender and receiver process
process.on('exit',function(){
    //stop the interval
   clearInterval(interval);
    receiver.stop();
    sender.stop();

    process.exit();
});



