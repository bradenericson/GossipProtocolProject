/**
 *      Braden, Chad, Matt
 *
 *      Class Variables:
 *          var service
 *              creates a new DatagramSenderReceiver object

 *      Method:
 *          service.run = function()
 *              add a message the the incoming messages queue
 *
 *          service.stop = function()
 *              closes the socket
 *
 *          service.action = function()
 *              take a message from the queue and return it
 *
 *       Modification History
 *          Original Version
 *              April 23, 2015
 */

var DatagramSenderReceiver = require('./DatagramSenderReceiver.js');

module.exports = function(datagramSocket, incomingPacketQueue, packetSize) {

    var service = new DatagramSenderReceiver(datagramSocket, incomingPacketQueue, packetSize);
    service.run = function(){
        service.socket.on('message', function(msg, rinfo) {

            incomingPacketQueue.add(msg);
            console.log('Received %d bytes from %s:%d\n',
                msg.length, rinfo.address, rinfo.port);
        });
    };

    //closes the socket
    service.stop = function(){
        service.socket.close();
    };

    //take a message from the queue and return it
    service.action = function(){

       if(service.queue.length() > 0){
           var udp = service.queue.remove();
           /*console.log("The message:",udp.getMessage());
           console.log("The id1:",udp.getID1().id);
            */
           return udp;

       }else{
           return null;
       }
    };




    return service;
};
