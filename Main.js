/**
 * Created by Chad Luangrath on 4/28/2015.
 */

//var datagramPacket = require('dgram'); //don't need - all communication done through transceiver

var messenger = require('messenger');
var transceiverChild = messenger.createSpeaker(10001);//speaking to transceiver
var resourceManagerChild = messenger.createSpeaker(10002);//speaking to ResourceManager
var server = messenger.createListener(10000); //listens for messages on port 8000
var UIChild = messenger.createSpeaker(10003);
var childProcess = require("child_process");

var TimeToLive = require('./UDP/TimeToLive.js');
var UDPMessage = require('./UDP/UDPMessage.js');
var IdFactory = require('./UDP/ID/IDFactory.js');

var idFactory = new IdFactory();

var searchRequestIds = new Array();


childProcess.fork(__dirname + "/Transceiver.js");
childProcess.fork(__dirname + "/ResourceManager/ResourceManager.js");

process.on('message', function (m) {
    if (m === "join") {
        //Joiner multicasts the UDP Message to everyone
       /* console.log("Creating the join datagram packet");

        var socket = datagramPacket.createSocket('udp4');

        socket.bind(null, null, function() {
            socket.setBroadcast(true);
            socket.setMulticastTTL(128);
        });

        var newBuffer = new Buffer(idFactory.idFactory());
        var zeroIdBuffer = new Buffer(idFactory.getZeroID());
        var ttlBuffer = new Buffer(new TimeToLive(0));

        var testBuffer = new Buffer("message");

        var completedBuffer = Buffer.concat([newBuffer, zeroIdBuffer, ttlBuffer]);
        console.log("completedBuffer: " + completedBuffer);

        socket.send(testBuffer, 0, testBuffer.length, 7000, '224.1.1.1', function () {
            console.log("Multicasted the join message to 224.1.1.1:5007!");
        });
        //process.send({message: "hello dad"});
        //instead we should use messenger package
*/
    }
});

//WHERE SHIT HAPPENS
server.on('transceiver-to-main', function(message, data){
   //data = UDP message
    //console.log("got UDP message");
    //code that handles what to do with the packet
    var udp = new UDPMessage();
    udp.createFromDatagramPacket(data);
    console.log("ID1: ", udp.getID1().id);
    console.log("ID2: ", udp.getID2().id);
    console.log("TTL: ", udp.getTimeToLive().get());
    console.log("message: ", udp.getMessage());

    //if we are building a resource
    resourceManagerChild.request('main-to-resourceManager', {message: 'data'}, function(data) {
        console.log('main to resource manager data: ' + data);
    });

    //in response to a 'cats' query or what have you
    //could be a response to one of our packets
    if(searchRequestIds.indexOf(udp.getID2().id) >= 0 || true ){
        console.log("Sending to UI: ", udp);
        UIChild.request('main-to-UI', {data: JSON.stringify(udp)}, function(data) {
            console.log('main to UI data: ' + data);
        });
    }


    //sending back to transceiver
    //could be a packet we need to send on
    transceiverChild.request('main-to-transceiver', {message: 'data'}, function(data){
        console.log('main back to transceiver data: ' + data);
    });
    message.reply({message: "success"});
    //could be a dead packet
});

//listening to messages coming in from resource manager
server.on('resourceManager-to-main', function(message, data) {

    //get something from resource manager usually goes to transceiver
    transceiverChild.request('main-to-transceiver', {message: 'data'}, function(data) {
        console.log('data sending from main to transceiver: ' + data);
    });
});

//listening to messages coming in from UI
server.on('UI-to-main', function(message, data) {
    //could go to resourceManager
    //can also go to transceiver
    transceiverChild.request('main-to-transceiver', {message: 'data'}, function (data) {
        console.log('data sending from transceiver to main: ' + data);
    });
});

server.on('ui-resource-rename', function(message, data) {
    resourceManagerChild.request("ui-resource-rename", data, function(status) {
        message.reply(status);
    });
});

server.on('ui-resource-description', function(message, data) {
    resourceManagerChild.request('ui-resource-description', data, function(status) {
        message.reply(status);
    });
});

server.on('ui-resource-add-tags', function(message, data) {
    resourceManagerChild.request('ui-resource-add-tags', data, function(status) {
        message.reply(status);
    });
});

server.on('ui-resource-remove-tags', function(message, data) {
    resourceManagerChild.request('ui-resource-remove-tags', data, function(status) {
        message.reply(status);
    });
});

server.on('ui-resource-search', function(message, searchPhrase) {

    var udpMessage = new UDPMessage();
    var ttl = new TimeToLive(3);

    var id1 = idFactory.idFactory().id;
    var id2 = idFactory.idFactory().id;

    var searchUdpMessage = udpMessage.createForFindRequest(id1, id2, ttl, searchPhrase);

    //console.log("searchUdpMessage's ID1: ", searchUdpMessage.getID1());
    //console.log("searchUdpMessage's ID2: ", searchUdpMessage.getID2());
    //console.log("searchUdpMessage's TimeToLive: ", searchUdpMessage.getTimeToLive().get());
    //console.log("searchUdpMessage's message: ", searchUdpMessage.getMessage());

    transceiverChild.request('main-to-transceiver', searchUdpMessage.createUdpPacket(), function(status) {
        if (status === "success") {
            searchRequestIds.push(id1); //ID1 is the request ID from originating peer (us). Store that onto the array
            //console.log("Just pushed id1 onto the searchRequestIds array: ", id1);
            message.reply("success");
        }
    });
});

//process.send({ foo: 'bar' });