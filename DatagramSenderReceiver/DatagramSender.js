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
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize, addressBook) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);

    //sends a datagram message off TODO
    service.action = function(){
        //console.log("queue size:", service.queue.length());
        var addresses = service.getAddresses();
        if(service.queue.length() > 0){
            var message = service.queue.remove();

          //  console.log("message in datagramsender is: ", message.data);
            for(var i=0; i<addresses.length; i++){
                //console.log("sending to address: ", addresses[i]);
                //console.log("sending on port: ", service.getPort());

                var addressToSendTo = addresses[i].toString();

                service.socket.send(new Buffer(message.data), 0, message.data.length, service.getPort(), addressToSendTo, function(){
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