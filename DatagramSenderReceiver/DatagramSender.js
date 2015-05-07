/**
 * Created by braden on 4/23/15.
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);
    service.action = function(queue){
        console.log("queue size:", queue.length());
        if(queue.length() > 0){
            var message = queue.remove();
           // console.log(message.mes);
            var buffer = new Buffer(message);
            service.socket.send(buffer, 0, buffer.length, service.getPort(), service.getAddress(), function(){
                console.log("message sent");
            });
            service.socket.send(buffer, 0, buffer.length, service.getPort(), service.getAddress(), function(){
                console.log("message send 2");
            })
        }else{
            console.log('nothing in the send queue');
        }
    };

    return service;
};