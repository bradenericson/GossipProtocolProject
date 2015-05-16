/**
 * Created by braden on 4/23/15.
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize, addressBook) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);
    service.action = function(){
        //console.log("queue size:", service.queue.length());
        var addresses = service.getAddresses();
        if(service.queue.length() > 0){
            var message = service.queue.remove();
           // console.log(message.mes);
            for(var i=0; i<addresses.length; i++){
                service.socket.send(message, 0, message.length, service.getPort(), addresses[i], function(){
                    console.log("message sent");
                });
            }
        }else{
            //console.log('nothing in the send queue');
        }
    };

    service.addressBook = addressBook;
    service.getAddresses = function(){
        return service.addressBook.getAddresses();
    };
    service.getAddress = function(index){
        return service.addressBook.getAddress(index);
    };

    return service;
};