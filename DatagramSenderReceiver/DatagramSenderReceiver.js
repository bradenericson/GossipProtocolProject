/**
 * Braden, Chad, Matt
 *
 *      Class Variables
 *          packetSize
 *          done
 *          timeoutObject
 *          intervalObject
 *
 *      Method
 *          service.action = function()
 *                 overwritten by either the sender or receiver class
 *
 *          service.getPort = function()
 *              returns the portNumber being used
 *
 *          service.getPacketSize = function()
 *              returns the packetsize being used
 *
 *          service.isStopped = function()
 *              TODO
 *
 *          service.run = function()
 *              runs service.action every second
 *
 *          service.start = function()
 *              begins service.run
 *
 *          service.stop = function()
 *              halts service.run
 *
 *          service.getAddress = function()
 *              returns the localhost address
 *
 *      Modification History
 *          Original Version
 *              April 23 2015
 */


module.exports = function(datagramSocketInput, packetQueue, packetSizeInput) {


    var packetSize = packetSizeInput || 476;

    var done = false;
    var timeoutObject;
    var intervalObject;

    var service = {};
    service.queue = packetQueue;

    //overwritted by sender and receiver classes
    service.action = function(){
        console.log("sending and receiving one... this gets overwritten");
    };

    service.socket = datagramSocketInput;

    //returns the port number being used
    service.getPort = function(){
        return "12345";
    };

    //returns the packetsize being used
    service.getPacketSize = function(){
        return packetSize;
    };

    //TODO
    service.isStopped = function(){
        return done; //returns true or false
    };

    //runs service.action every second
    service.run = function(){
        //create the sub service
        intervalObject = setInterval(function(){

            service.action();
        },2);
    };

    //begins service.run
    service.start = function(){
        service.run();
    };

    //halts service.run
    service.stop = function(){
      //stop the process
        clearInterval(intervalObject);
        datagramSocket.close();
    };

    //returns the localhost address
    service.getAddress = function(){
      return 'localhost';
    };
    
    return service;
};