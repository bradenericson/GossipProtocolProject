/**
 * Created by Chad Luangrath on 4/23/2015.
 */

module.exports = function(byteArray, datagramPacket, startingByte, hexString) {
    var self = {};

    self.id;

    if (typeof byteArray != "undefined") {
        self.id = byteArray;
    }
    else if (typeof datagramPacket != "undefined" && typeof startingByte != "undefined") {

    }
    else if (typeof hexString != "undefined") {
        self.id = parseInt(hexString, 16);
    }
    else {
        throw new Error("No valid parameter combination detected for ID constructor");
    }

    self.getAsHex = function() {
        return createHexString(self.id);
    };

    self.getBytes = function() {
        return self.id.slice(0);
    };

    self.equals = function(object) {
        return object === self;
    };

    self.hashCode = function(object) {

    };

    self.isZero = function() {
        var isZero = false;

        for(var i = 0; i < self.id.length; i++) {
            if (self.id[i] == 0) {
                isZero = true;
            }
        };

        return isZero;
    };

    //TODO
    self.isRequestID = function() {
        return false;
    };

    //TODO
    self.isResourceID = function() {
        return false;
    }

    /* Helper Functions */

    function createHexString() {
        var result = "";

        for(var i = 0; i < self.id.length; i++) {
            result += self.id[i].toString(16);
        }

        return result;
    }

    return self;
}