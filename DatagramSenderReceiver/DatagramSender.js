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

module.exports = function(datagramSocket, incomingPacketQueue, packetSize, addressBook) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);

    //sends a datagram message off TODO
    service.action = function(){
        //console.log("queue size:", service.queue.length());
        if(service.queue.length() > 0){
            var message = service.queue.remove();
           // console.log(message.mes);
            var buffer = new Buffer(message);
            var addresses = service.getAddresses();
            for(var i=0; i<addresses.length; i++){
                service.socket.send(buffer, 0, buffer.length, service.getPort(), address[i], function(){
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