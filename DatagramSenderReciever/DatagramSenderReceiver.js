/**
 * Created by braden on 4/23/15.
 */


module.exports = function(datagramSocketInput, packetQueue, packetSizeInput) {

    var datagramSocket = datagramSocketInput;
    var packetSize = packetSizeInput;
    var queue = packetQueue;
    var done = false;

    var service = {};
    service.action = function(datagramSocket, queue){
        console.log("sending and receiving one... we don't want this");
    };

    service.getPort = function(){
        return "12345";
    };

    service.getPacketSize = function(){
        return packetSize;
    };

    service.isStopped = function(){
        return done; //returns true or false
    };

    service.run = function(){
        //create the sub service
       service.action(datagramSocket,queue);
    };

    service.startAsThread = function(){

    };

    service.stop = function(){
      //stop the process
    };



    return service;
};