/**
 *  Braden, Chad, Matt
 *
 *  This class will manipulate IDs and has added functionality for them
 *
 *  Class Variables
 *
 *  Methods:
 *      self.getAsHex = function()
 *          returns the ID as a hex string
 *
 *      self.getBytes = function()
 *          return ID in bytes <--- TODO?
 *
 *      self.equals = function(object)
 *          tests equality in value and type between argument and ID
 *
 *      self.hashCode = function(object)
 *          get the hashcode of the passed object, usually and ID
 *
 *      self.isZero = function()
 *          tests to see the byte array is all 0s or not. Used with IDs to test if join state
 *
 *      self.toString = function()
 *          returns ID object as a string
 *
 *      self.isRequestID = function()
 *          return true if ID is request id
 *
 *      self.isResourceID = function()
 *          return true if ID is resource id
 *
 *      function createHexString()
 *          TODO
 *
 *      Modification History
 *          Created Original Version
 *              April 23, 2015
 *
 */

module.exports = function(byteArray) {
    var self = {};

    if (typeof byteArray != "undefined") {
        self.id = byteArray;
    }
    else {
        throw new Error("No valid parameter combination detected for ID constructor");
    }

    //returns the ID as a hex string
    self.getAsHex = function() {
        return createHexString(self.id);
    };

    //return ID in bytes <--- TODO?
    self.getBytes = function() {
        return self.id.slice(0);
    };

    //tests equality in value and type between argument and ID
    self.equals = function(object) { //TODO
        return object === self;
    };

    //get the hashcode of the passed object, usually and ID
    self.hashCode = function(object) {

    };

    //tests to see the byte array is all 0s or not. Used with IDs to test if join state
    self.isZero = function() {
        var isZero = false;

        for(var i = 0; i < self.id.length; i++) {
            if (self.id[i] == 0) {
                isZero = true;
            }
        }

        return isZero;
    };

    //returns ID object as a string
    self.toString = function() {
        return self.id.toString();
    };

    //return true if ID is request id
    self.isRequestID = function() {
        return false;
    };

    //return true if ID is resource id
    self.isResourceID = function() {
        return false;
    };

    /* Helper Functions */

    //TODO
    function createHexString() {
        var result = "";

        for(var i = 0; i < self.id.length; i++) {
            result += self.id[i].toString(16);
        }

        return result;
    }

    return self;
}