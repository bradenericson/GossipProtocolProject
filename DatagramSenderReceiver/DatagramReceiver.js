/**
 * Created by braden on 4/23/15.
 *
 *      Class Variables:
 *          var service
 *              creates a new DatagramSenderReceiver object

 *      Method:
 *          service.run = function()
 *          service.stop = function()
 *          service.action = function()
 *
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

    service.stop = function(){
        service.socket.close();
    };

    service.action = function(){
      //console.log('listening for packets');
       if(service.queue.length() > 0){
           var udp = service.queue.remove();
           /*console.log("The message:",udp.getMessage());
           console.log("The id1:",udp.getID1().id);
           console.log("The id2:",udp.getID2().id);
           console.log("The TTL:",udp.getTimeToLive().get());
           console.log("sending off to Main:", udp);*/
           return udp;

       }else{
           //console.log("no new packets have been received");
           return null;
       }
    };




    return service;
};
