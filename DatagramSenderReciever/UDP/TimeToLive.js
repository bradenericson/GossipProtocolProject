/**
 * Created by matt on 4/23/15.
 */

module.exports = function(timeToLive_in) {

    var timeToLive;

    var self = {};

    if (typeof timeToLive_in != "undefined") {
        timeToLive = timeToLive_in;
    }
    else {
        throw new Error("Invalid parameter was entered!");
    }

    self.getLengthInBytes = function() {
        return timeToLive.length;
    };

    self.get = function() {
        return timeToLive;
    };

    self.set = function(timeToLive) {
        timeToLive = timeToLive - 1;
        return timeToLive;
    };

    self.getBytes = function() {
       return timeToLive.toString("utf8", 32, 47);
    };

    self.toString = function() {
        return timeToLive.toString();
    };

    return self;
};
