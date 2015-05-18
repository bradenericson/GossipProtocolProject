/**
 * Created by Chad Luangrath on 4/28/2015.
 *
 *      Chad, Braden, Matt
 *
 *      Class Variables:
 *          transceiverChild
 *              speaker to transceiver
 *          resourceManagerChild
 *              speaker to resource manager
 *          server
 *              main listener
 *          UIChild
 *              speaker to UI
 *          idFactory
 *              creates a new idFactory objecy
 *          searchRequestIds
 *              stores all our request ids that we have sent out
 *          getRequestIds
 *              same thing but holds ids of get requests we send
 *
 *      Methods:
 *          server.on('transceiver-to-main', function(message, data)
 *              listening from transceiver
 *          server.on('resourceManager-to-main', function(message, data)
 *              listening from resource manager
 *          server.on('ui-resource-get-request', function(message, data)
 *              listening for get request from UI
 *          server.on('ui-resource-rename', function(message, data)
 *              listening for rename of resource coming from UI
 *          server.on('ui-resource-description', function(message, data)
 *              listening for resource description coming from UI
 *          resourceManagerChild.request('ui-resource-description', data, function(status)
 *              sending request to resource manager, passing it from UI
 *          server.on('ui-resource-add-tags', function(message, data)
 *              listening for request to add tags to a specific resource, coming from UI
 *          server.on('ui-resource-remove-tags', function(message, data)
 *              listening for request to remove tags from a specific resource, coming from UI
 *          server.on('ui-resource-search', function(message, searchPhrase)
 *              listening for a search request for a resource, coming from UI
 *
 *      Modification History
 *          Original Version
 *              April 28 2013
 *
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
var ID = require('./UDP/ID/ID.js');

var searchRequestIds = [];
var getRequestIds = []; //seperated out the GET requests because our ResourceManager will be

var listOfReceivedResources = new Array();
var resourceFromCollection;

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
    //code that handles what to do with the packet
    var udp = new UDPMessage();

    if (data != null) {
        var tempData = data.data;
        var id2 = new ID(tempData.slice(16, 32));
        var resource;
        //console.log("The ID2: ",id2.id);
        //Response to Find Matching Resources Request

        //console.log("ID2: ", id2.id.toString());
        //console.log("searchRequestIds: ", searchRequestIds);

        if (searchRequestIds.indexOf(id2.id.toString()) >= 0) {

            //if the second id is the same as our original request ID, it's a 'Response to Find Matching Resources Request'
            udp.createForReceivingFindRequest(data);

            if (udp.getTimeToLive().get() > 0) {
                udp.getTimeToLive().decrement();

                //console.log("udp.Id1: ", udp.getID1().id.toString());
                //console.log("udp.Id2: ", udp.getID2().id.toString());
                //console.log("udp.ttl: ", udp.getTimeToLive().get());
                //console.log("udp.getMessage: ", udp.getMessage().toString());

                var delimiter = udp.getMessage().toString().substring(0, 1);
                //console.log("got the delimiter: ", delimiter);

                var data = udp.getMessage().toString().substring(1).split(delimiter);

                resource = {
                    resourceId: udp.getID1().id,
                    mimeType: data[0],
                    resourceSize: data[1],
                    description: data[2]
                };

                UIChild.request('main-to-UI', resource, function (data) {
//                    console.log('main to UI data: ' + data);
                    listOfReceivedResources.push(resource);
                });
            }
        }

        //if we are building a resource
        else if (getRequestIds.indexOf(id2.id.toString()) >= 0) {
            //console.log("HORRRRRY SHIT!!!! Data: ", data);
            udp.createForGetResponse(data);

            if (udp.getTimeToLive().get() > 0) {
                udp.getTimeToLive().decrement();

                resource = {
                    resourceId: udp.getID1().id,
                    partNumber: udp.partNumber,
                    bytesFromResource: new Buffer(udp.bytesFromResource).toString(),
                    requestId: udp.getID2().id
                };

                //console.log("resource: ", resource);

                resourceManagerChild.request('main-to-resourceManager-build', resource, function (data) {
                    //console.log('main to resource manager data: ' + data);
                });
            }
        }

        else {
            //pass it to resourceManager to deal with
            resourceManagerChild.request('main-to-resourceManager', data, function () {
                console.log("sent to resourceManager successful")
            })
        }

    }

    message.reply({message: "success"});

});

//listening to messages coming in from resource manager
server.on('resourceManager-to-main', function(message, data) {

    //This listener will listen for packets that we're forwarding as well. Send those back to transceiver in order to be forwarded on.
        //--ResourceManager was needed to distinguish what type of packets we received. Those that we CANNOT FULFILL, we just pass onto transceiver
        //--from here.

    //get something from resource manager usually goes to transceiver
    transceiverChild.request('main-to-transceiver', data, function(data) {
        //console.log('data sending from main to transceiver: ' + data);
        message.reply("success");
    });
});

//listening to messages coming in from UI
server.on('ui-resource-get-request', function(message, data) {
    /*
     data.resourceId : Resource ID that we're requesting
     data.targetResourceName: Desired resource name for the file requested
     data.timeToLive: Optional time to live parameter passed by user
     */

    var partNumber = 0; //we're searching for the very first piece

    //create a UDP object for get Request
    var udp = new UDPMessage();
    udp.createForGetRequest(data.resourceId, partNumber, data.timeToLive, idFactory.idFactory());

    //console.log("listOfReceivedResources: ", listOfReceivedResources);

    //loop through our resource list from the FIND request and get the mimetype, filesize, description, etc
    for(var i = 0; i < listOfReceivedResources.length; i++) {

        //console.log("listOfReceivedResources[i].resourceId.toString(): ", listOfReceivedResources[i].resourceId.toString());
        //console.log("data.resourceId.toString(): ", data.resourceId.toString());

        if (listOfReceivedResources[i].resourceId.toString() === data.resourceId.toString()) {
            //console.log("Resource found!");
            resourceFromCollection = listOfReceivedResources[i];
            break; //save cycles
        }
    }

    //This loop will append the file information to the data object for the resourceManager to use
    for(var prop in resourceFromCollection) {
        if(resourceFromCollection.hasOwnProperty(prop)){
            data[prop] = resourceFromCollection[prop];
        }
    }
    //data = {resourceId, targetResourceName, timeToLive, mimeType, resourceSize, description}

    console.log("data in Main.js: ", data);

    resourceManagerChild.request('start-writeStream', data, function(reply){
        if(reply === "success"){
            //only send the request to peers IF the writeStream opens successfully

            var udpPacket = udp.createUdpPacket();

            //console.log("udp.createUdpPacket: ", udpPacket);

            transceiverChild.request('main-to-transceiver', udpPacket, function (data) {
                console.log('data sending from transceiver to main: ' + data);
                if (data === "success") {
                    getRequestIds.push(udp.getID1().id.toString());
                    //console.log("getRequestIds after pushing new GET Request ID onto it: ", getRequestIds);
                }
            });
        }
        else {
            console.log(reply);
        }
    });


});

//listening for rename of resource coming from UI
server.on('ui-resource-rename', function(message, data) {
    resourceManagerChild.request("ui-resource-rename", data, function(status) {
        message.reply(status);
    });
});

//listening for resource description coming from UI
server.on('ui-resource-description', function(message, data) {
    resourceManagerChild.request('ui-resource-description', data, function(status) {
        message.reply(status);
    });
});

//listening for request to add tags to a specific resource, coming from UI
server.on('ui-resource-add-tags', function(message, data) {
    resourceManagerChild.request('ui-resource-add-tags', data, function(status) {
        message.reply(status);
    });
});

//listening for request to remove tags from a specific resource, coming from UI
server.on('ui-resource-remove-tags', function(message, data) {
    resourceManagerChild.request('ui-resource-remove-tags', data, function(status) {
        message.reply(status);
    });
});

//listening for a search request for a resource, coming from UI
server.on('ui-resource-search', function(message, searchPhrase) {

    //listOfReceivedResources = []; //reset the listOfReceivedResources array to an empty array when we initiate a new search

    var udpMessage = new UDPMessage();
    var ttl = new TimeToLive(5);

    var id1 = idFactory.idFactory();
    var id2 = idFactory.idFactory();

    //console.log("id1: ", id1.id);
    //console.log("id2: ", id2.id);
    //console.log("ttl: ", ttl.get());
    //console.log("search phrase: ", searchPhrase);

    var searchUdpMessage = udpMessage.createForFindRequest(id1, id2, ttl, searchPhrase);

    //console.log("searchUdpMessage's ID1: ", searchUdpMessage.getID1().id);
    //console.log("searchUdpMessage's ID2: ", searchUdpMessage.getID2().id);
    //console.log("searchUdpMessage's TimeToLive: ", searchUdpMessage.getTimeToLive().get());
    //console.log("searchUdpMessage's message: ", searchUdpMessage.getMessage());

    transceiverChild.request('main-to-transceiver', searchUdpMessage.createUdpPacket(), function(status) {
        if (status === "success") {
            searchRequestIds.push(id1.id.toString()); //ID1 is the request ID from originating peer (us). Store that onto the array
            //console.log("Just pushed id1 onto the searchRequestIds array: ", id1);
            message.reply("success");
        }
    });
});

//process.send({ foo: 'bar' });