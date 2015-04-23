/**
 * Created by matt on 4/23/15.
 */

module.exports = function(timeToLiveInput, byteArray) {
    var self = {};

    if (typeof timeToLiveInput != "undefined") {
        var timeToLive = timeToLiveInput;
    }
    else if (typeof byteArray != "undefined") {

    }
    else {
        throw new Error("Invalid parameter was entered!");
    }

    self.getLengthInBytes = function() {

    }

    self.get = function() {
        return timeToLive;
    }

    self.set = function(timeToLive) {
        timeToLive = timeToLive - 1;
        return timeToLive;
    }

    self.getBytes = function() {
        return
    }
}
