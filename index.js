/**
 * Created by Chad Luangrath on 4/16/2015.
 * and Matt Woelfel
 */

var IDFactory = require('./IDFactory.js');

var test = new IDFactory();

console.log(test.sayHello());

//var dgram = require('dgram');
//var s = dgram.createSocket('udp4');
//s.bind(1234, function() {
//    console.log('binding');
//    s.addMembership('224.0.0.114');
//});
//s.on('message', function(msg, rinfo) {
//    console.log('Received %d bytes from %s:%d\n',
//        msg.length, rinfo.address, rinfo.port);
//    console.log(msg.toString('utf-8'));
//});
///*
//s.send(buf, offset, length, port, address, function(){
//    console.log('message sent');
//    });
//    */
//function bin2String(array) {
//    var result = "";
//    for (var i = 0; i < array.length; i++) {
//        result += String.fromCharCode(parseInt(array[i], 2));
//    }
//    return result;
//}
