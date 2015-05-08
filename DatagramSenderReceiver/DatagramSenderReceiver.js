/**
 * Created by braden on 4/23/15.
 */


module.exports = function(datagramSocketInput, packetQueue, packetSizeInput) {


    var packetSize = packetSizeInput || 476;

    var done = false;
    var timeoutObject;
    var intervalObject;

    var service = {};
    service.queue = packetQueue;
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
        intervalObject = setInterval(function(){
            console.log("checking the queue" + Math.random());
            service.action();
        },1000);
    };

    service.start = function(){
        service.run();
    };

    service.stop = function(){
      //stop the process
        clearInterval(intervalObject);
        datagramSocket.close();
    };

    service.getAddress = function(){
      return 'localhost';
    };



    return service;
};