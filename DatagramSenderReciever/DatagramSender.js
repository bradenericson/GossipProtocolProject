/**
 * Created by braden on 4/23/15.
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);
    service.action = function(){
        var message = new Buffer("Some bytes");
        service.socket.send(message, 0, message.length, service.getPort(), service.getAddress(), function(){
            //clear to send another
            console.log('message sent');
        });
        console.log('sending packets');
    };

    return service;
};