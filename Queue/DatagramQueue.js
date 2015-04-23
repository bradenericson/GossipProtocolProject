/**
 * Created by braden on 4/23/15.
 */

module.exports = function(){
    var queue = [];

    var service = {};

    service.add = function(value){
        queue.push(value);
    };

    service.remove = function(){
        queue.shift();
    };

    service.length = function(){
        return queue.length;
    };

    service.peek = function(){
        var result;

        result = null;
        if(queue.length > 1){
            result = queue[0];
        }

        return result;
    };

    service.isEmpty = function(){
        return queue.length === 0;
    };

    service.concatArray = function(array){
        queue.concat(array);
    };


    return service;
};