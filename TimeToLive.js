/**
 * Created by matt on 4/23/15.
 */

module.exports = function(timeToLive_in, byteArray) {

    var timeToLive

    var self = {};

    if (typeof timeToLive_in != "undefined") {
        timeToLive = timeToLive_in;
    }
    else if (typeof byteArray != "undefined") {
        timeToLive = byteArray;
    }
    else {
        throw new Error("Invalid parameter was entered!");
    }

    self.getLengthInBytes = function() {
        var bytes;
        bytes = timeToLive.slice(2);

    }

    self.get = function() {
        return timeToLive;
    }

    self.set = function(timeToLive) {
        timeToLive = timeToLive - 1;
        return self.ttl;
    }

    self.getBytes = function() {
       return timeToLive.slice(2);
    }

    self.toString = function() {
        return timeToLive.toString();
    }

    return self;
}
