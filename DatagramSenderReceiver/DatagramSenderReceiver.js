/**
 *      Braden, Chad, Matt
 *
 *      Class Variables:
 *          packetSize
 *              takes packet size from constructor argument, or 476
 *          done
 *              returns false always!?
 *          timeoutObject
 *              TODO
 *          intervalObject
 *              TODO
 *
 *      Methods:
 *          service.action = function()
 *              pulls something from the queue if it is not empty, overwritten by sender and receiver classes
 *
 *          service.getPort = function()
 *              returns the port number being used
 *
 *          service.getPacketSize = function()
 *              returns the packet size being used
 *
 *          service.isStopped = function()
 *              TODO
 *
 *          service.run = function()
 *              every second, run service.action
 *
 *          service.start = function()
 *              begins service.run
 *
 *          service.stop = function()
 *              halt service.run
 *
 *          service.getAddress = function()
 *              returns localhost
 *
 *      Modification History
 *          Original Version
 *              April 23, 2015
 *
 */


module.exports = function(datagramSocketInput, packetQueue, packetSizeInput) {


    var packetSize = packetSizeInput || 476;
    var done = false;
    var timeoutObject;
    var intervalObject;

    var service = {};
    service.queue = packetQueue;

    //overwritten by sender and receiver classes
    service.action = function(){
        console.log("sending and receiving one... this gets overwritten");
    };

    service.socket = datagramSocketInput;

    //returns the port being used
    service.getPort = function(){
        return "12345";
    };

    //returns the packetSize being used
    service.getPacketSize = function(){
        return packetSize;
    };

    //TODO
    service.isStopped = function(){
        return done; //returns true or false
    };

    //every second, run service.action
    service.run = function(){
        //create the sub service
        intervalObject = setInterval(function(){
            //console.log("checking the queue" + Math.random());
            service.action();
        },1000);
    };

    //begin service.run
    service.start = function(){
        service.run();
    };

    //stop the intervalObject process
    service.stop = function(){
      //stop the process
        clearInterval(intervalObject);
        datagramSocket.close();
    };

    //returns the address localhost
    service.getAddress = function(){
      return 'localhost';
    };

    return service;
};