/**
 * Created by Chad on 4/23/15.
 *
 *      Class Variables:
 *          idQueue
 *              holds all of the generated IDs
 *
 *          idLength
 *              length of the IDs
 *
 *          queueSizeLimit
 *              maximum size of the queue
 *
 *      Methods:
 *          self.idFactory = function()
 *              returns id if there is an id in the queue, otherwise creates a new id
 *
 *          self.generateId = function()
 *              creates an id and puts in into the queue
 *
 *          self.getLengthInBytes = function()
 *              get the length of the id in bytes
 *
 *          self.getMaxQueueLength = function()
 *              returns the max queue length of the queue
 *
 *          self.setMaxQueueLength = function(newQueueLength)
 *              sets the max queue length of the id queue
 *
 *          self.getQueueLength = function()
 *              return the current length of the queue
 *
 *          self.getZeroID = function()
 *              creates a zeroID
 *
 *          self.setLengthInBytes = function(lengthInBytes)
 *              TODO
 *
 *      Version History
 *          Original Version
 *              April 23 2015
 *
 */

var ID = require("./ID.js");
var secureRandom = require("../../../node_modules/secure-random");

module.exports = function() {
    var self = {};

    var idQueue = new Array();

    var idLength = 16; //the number of bits we're using for our IDs

    var queueSizeLimit = 500;

    /* Public Methods */
    //returns id if there is an id in the queue, otherwise creates a new id
    self.idFactory = function() {
        if (idQueue.length > 0) {
            return idQueue.pop();
        }
        else {
            return new ID(secureRandom(16, { type: 'Array' }));
            //throw new Error("Queue Underflow Exception. There are no IDs in the idQueue right now!");
        }
    };

    //creates an id and puts in into the queue
    self.generateId = function() {
        var byteIdArray = secureRandom(16, { type: 'Array' });

        idQueue.push(new ID(byteIdArray));
    };

    //get the length of the id in bytes
    self.getLengthInBytes = function() {
        return idLength;
    };

    //returns the max queue length of the queue
    self.getMaxQueueLength = function() {
        return queueSizeLimit;
    };

    //sets the max queue length of the id queue
    self.setMaxQueueLength = function(newQueueLength) {
        if (isNaN(newQueueLength)) {
            throw new Error("Passed newQueueLength parameter is not a number!");
        }
        queueSizeLimit = newQueueLength;
    };

    //return the current length of the queue
    self.getQueueLength = function() {
        return idQueue.length;
    };

    //creates a zeroID
    self.getZeroID = function() {
        return createZeroID();
    };

    //TODO
    self.setLengthInBytes = function(lengthInBytes) {
        if (isNaN(lengthInBytes)) {
            throw new Error("Passed lengthInBytes parameter is not a number!");
        }

        idLength = lengthInBytes;

    };

    /* Private Methods */

    var getQueue = function() {
        return idQueue;
    };

    var createZeroID = function() {
        var zeroByteArray = new Array(idLength);

        for(var i = 0; i < zeroByteArray.length; i++) {
            zeroByteArray[i] = 0;
        }

        return new ID(zeroByteArray);
    };

    return self;
};