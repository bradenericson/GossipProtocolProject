/**
 * Created by braden on 4/23/15.
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