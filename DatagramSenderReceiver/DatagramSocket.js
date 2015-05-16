/**
 *      Braden, Chad, Matt
 *
 *      Class Variables
 *          portNumber
 *              return the global port, or port 12345
 *          socket
 *              creates a new udp4 datagram socket
 *
 *      Methods
 *          socket.bind(portNumber, function()
 *              binds the sockey to the port number being used
 *
 *      Modification History
 *          Original Version
 *              April 23 2015
 */

var datagram = require('dgram');

module.exports = function(){
    var portNumber = global.port || 12345;
    var socket = datagram.createSocket('udp4');
    socket.bind(portNumber, function() {
        console.log('binding');
        socket.addMembership('224.0.0.114');
    });
    return socket;

};


//
//
//
//
///*
//
//    */
//function bin2String(array) {
//    var result = "";
//    for (var i = 0; i < array.length; i++) {
//        result += String.fromCharCode(parseInt(array[i], 2));
//    }
//    return result;
//}