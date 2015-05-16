/**
 *      Braden, Chad, Matt
 *
 *      Class Variables:
 *          service
 *              creates a new datagramSenderReceiver object
 *
 *      Methods:
 *          service.action = function()
 *              sends a datagram message off TODO
 *
 *      Modification History:
 *          Original Version
 *              April 23, 2015
 *
 *
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);

    //sends a datagram message off TODO
    service.action = function(){
        //console.log("queue size:", service.queue.length());
        if(service.queue.length() > 0){
            var message = service.queue.remove();
           // console.log(message.mes);
            var buffer = new Buffer(message);
            service.socket.send(buffer, 0, buffer.length, service.getPort(), service.getAddress(), function(){
                console.log("message sent");
            });
            service.socket.send(buffer, 0, buffer.length, service.getPort(), service.getAddress(), function(){
                console.log("message send 2");
            })
        }else{
            //console.log('nothing in the send queue');
        }
    };

    return service;
};