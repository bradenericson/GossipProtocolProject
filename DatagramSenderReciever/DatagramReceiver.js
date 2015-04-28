/**
 * Created by braden on 4/23/15.
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);
    service.action = function(){
      console.log('listening for packets');
        service.socket.on('message', function(msg, rinfo) {
            console.log('Received %d bytes from %s:%d\n',
                msg.length, rinfo.address, rinfo.port);
        });
    };

    return service;
};