/**
 * Created by braden on 4/23/15.
 */

var DatagramSender = require('./DatagramSenderReciever/DatagramSender.js');
var DatagramReceiver = require('./DatagramSenderReciever/DatagramReceiver.js');
var PacketQueue = require('./Queue/DatagramQueue.js');
var DatagramSocket = require('./DatagramSenderReciever/DatagramSocket.js');
var portNumber = 12345;
var packetSize = 32;
var incomingPacketQueue = new PacketQueue();
var outgoingPacketQueue = new PacketQueue();
var datagramSocket = new DatagramSocket();
var receiver = new DatagramReceiver(datagramSocket, incomingPacketQueue, packetSize);
var sender = new DatagramSender(datagramSocket, outgoingPacketQueue, packetSize);

receiver.action();
sender.action();
//sender.run();