/**
 * Created by Chad on 4/23/15.
 */

var ID = require("./ID.js");

module.exports = function() {
    var self = {};

    var idQueue = new Array();

    var idLength = 16; //the number of bits we're using for our IDs

    var queueSizeLimit = 500;

    /* Public Methods */
    self.idFactory = function() {
        if (idQueue.length > 0) {
            return idQueue.pop();
        }
        else {
            throw new Error("Queue Underflow Exception. There are no IDs in the idQueue right now!");
        }
    };

    self.generateId = function() {
        var byteArray = new Array(idLength);

        for(var i = 0; i < byteArray.length; i++) {
            byteArray[i] = Math.floor(Math.random() * (256 - 0)) + 0;
        }

        idQueue.push(new ID(byteArray));
    };

    self.getLengthInBytes = function() {
        return idLength;
    };

    self.getMaxQueueLength = function() {
        return queueSizeLimit;
    };

    self.setMaxQueueLength = function(newQueueLength) {
        if (isNaN(newQueueLength)) {
            throw new Error("Passed newQueueLength parameter is not a number!");
        }
        queueSizeLimit = newQueueLength;
    };

    self.getQueueLength = function() {
        return idQueue.length;
    };

    self.getZeroID = function() {
        return createZeroID();
    };

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