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

var searchRequestIds = [];
var getRequestIds = []; //seperated out the GET requests because our ResourceManager will be


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

    if (data != null) {
        var id2 = new ID(data.slice(16, 33));
        var resource;

        //Response to Find Matching Resources Request
        if (searchRequestIds.indexOf((id2.toString()) > 0)) {
            //if the second id is the same as our original request ID, it's a 'Response to Find Matching Resources Request'
            udp.createFromDatagramPacket(data);

            if (udp.getTimeToLive() > 0) {
                udp.getTimeToLive().decrement();

                console.log("Sending to UI: ", udp);

                var delimiter = udp.getMessage().substring(0, 1);

                var data = udp.getMessage().substring(1).split(delimiter);

                console.log("data in main: ", data);

                resource = {
                    resourceId: udp.getID1().id,
                    mimeType: data[0],
                    resourceSize: data[1],
                    description: data[2]
                };

                UIChild.request('main-to-UI', resource, function(data) {
                    console.log('main to UI data: ' + data);
                });
            }
        }

        //if we are building a resource
        else if(getRequestIds.indexOf(id2.toString() >= 0)) {

            udp.createForGetResponse(data);

            if (udp.getTimeToLive() > 0) {
                udp.getTimeToLive().decrement();

                resource = {
                    resourceId: udp.getID1().id,
                    partNumber: udp.partNumber,
                    bytesFromResource: udp.getMessage()
                };

                resourceManagerChild.request('main-to-resourceManager', resource, function (data) {
                    console.log('main to resource manager data: ' + data);
                });
            }
        }
    }

    console.log("ID1: ", udp.getID1().id);
    console.log("ID2: ", udp.getID2().id);
    console.log("TTL: ", udp.getTimeToLive().get());
    console.log("message: ", udp.getMessage());

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
server.on('ui-resource-get-request', function(message, data) {
    //could go to resourceManager also go to transceiver
    //data: {resourceId, timeToLive} <String>
    var partNumber = 0; //we're searching for the very first piece
    var udp = new UDPMessage().createForGetRequest(data.resourceId, partNumber, data.timeToLive);




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

    var id1 = idFactory.idFactory();
    var id2 = idFactory.idFactory();

    var searchUdpMessage = udpMessage.createForFindRequest(id1.id, id2.id, ttl, searchPhrase);

    //console.log("searchUdpMessage's ID1: ", searchUdpMessage.getID1());
    //console.log("searchUdpMessage's ID2: ", searchUdpMessage.getID2());
    //console.log("searchUdpMessage's TimeToLive: ", searchUdpMessage.getTimeToLive().get());
    //console.log("searchUdpMessage's message: ", searchUdpMessage.getMessage());

    transceiverChild.request('main-to-transceiver', searchUdpMessage.createUdpPacket(), function(status) {
        if (status === "success") {
            searchRequestIds.push(id1.toString()); //ID1 is the request ID from originating peer (us). Store that onto the array
            //console.log("Just pushed id1 onto the searchRequestIds array: ", id1);
            message.reply("success");
        }
    });
});

//process.send({ foo: 'bar' });