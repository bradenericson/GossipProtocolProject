/**
 * Created by braden on 4/23/15.
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);
    service.socket.on('message', function(msg, rinfo) {
        console.log(msg,rinfo);
        //TODO: Add Matt's code to convert UDP packet to object
        var UDPMessage = {message: msg.toString()};
        incomingPacketQueue.add(UDPMessage);
        console.log('Received %d bytes from %s:%d\n',
            msg.length, rinfo.address, rinfo.port);
    });
    service.action = function(queue){
      console.log('listening for packets');
       if(queue.length() > 0){
           var UDP = queue.remove();
           console.log("sending off to Main:", UDP);
           //process.send({UDP: UDP});

       }else{
           console.log("no new packets have been received");
       }
    };

    return service;
};