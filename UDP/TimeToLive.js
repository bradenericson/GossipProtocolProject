/**
 *      Braden, Chad, Matt
 *
 *      Class Variables:
 *          var timeToLive
 *              //TODO --> not sure how to describe this
 *
 *      Method:
 *          self.getLengthInBytes = function()
 *              returns the time to live length
 *
 *          self.get = function()
 *              returns the time to live var
 *
 *          self.set = function(timeToLive)
 *              decrements ttl
 *
 *          self.getBytes = function()
 *              get the ttl live bytes out of a UDP message
 *
 *          self.toString = function()
 *              returns the ttl as a string
 *
 *      Version History
 *          Original Version
 *              April 23 2015
 *
 */

module.exports = function(timeToLive_in) {

    var timeToLive;

    var self = {};

    if (typeof timeToLive_in != "undefined") {
        timeToLive_in = new Buffer(timeToLive_in).toString("utf8");

       timeToLive = timeToLive_in;

    }


    else {
        throw new Error("Invalid parameter was entered!");
    }

    //returns the time to live length
    self.getLengthInBytes = function() {
        return timeToLive.length;
    };

    //returns the ttl var
    self.get = function() {
        return timeToLive;
    };

    //set TTL to decrement
    self.set = function(timeToLive) {
        timeToLive = timeToLive - 1;
        return timeToLive;
    };

    //get the ttl live bytes out of a UDP message
    self.getBytes = function() {
       return timeToLive.toString("utf8", 32, 47);
    };

    //returns the ttl as a string
    self.toString = function() {
        return timeToLive.toString();
    };

    return self;
};
