/**
 * Created by braden on 4/23/15.
 */

var datagram = require('dgram');

module.exports = function(){
    var portNumber = global.port || 12345;
    var socket = datagram.createSocket('udp4');
    socket.bind(portNumber, function() {
        console.log('binding');
        //socket.addMembership('224.0.0.114');
    });

    socket.on('message', function(msg, rinfo) {
    console.log('Received %d bytes from %s:%d\n',
        msg.length, rinfo.address, rinfo.port);
    console.log(msg.toString('utf-8'));
        var buf = [];
        var offset = 0;
        var length = 1;
        var address = global.address;
    socket.send(buf, offset, length, portNumber, address, function(){
        console.log('message sent');
    });

    return socket;
});


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