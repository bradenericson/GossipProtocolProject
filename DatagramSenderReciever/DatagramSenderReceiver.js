/**
 * Created by braden on 4/23/15.
 */


module.exports = function(datagramSocketInput, packetQueue, packetSizeInput) {


    var packetSize = packetSizeInput;
    var queue = packetQueue;
    var done = false;

    var service = {};
    service.action = function(){
        console.log("sending and receiving one... this gets overwritten");
    };

    service.socket = datagramSocketInput;

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
       service.action(queue);
    };

    service.startAsThread = function(){

    };

    service.stop = function(){
      //stop the process
        datagramSocket.close();
    };

    service.getAddress = function(){
      return 'localhost';
    };



    return service;
};