/**
 *      Braden, Chad, Matt
 *
 *      Class Variables
 *          queue = []
 *              an array that will act as a queue to handle datagram packets
 *
 *      Method:
 *          service.add = function(value)
 *              pushes a value into the queue
 *
 *          service.remove = function()
 *              removes an item from the queue
 *
 *          service.length = function()
 *              returns the length of the queue
 *
 *          service.peek = function()
 *              looks at the element in the queue that will be popped next, but does not pop it
 *
 *
 *          service.isEmpty = function()
 *              returns true is the queue is empty
 *
 *          service.concatArray = function(array)
 *              concatenates an array onto the existing queue
 *
 *
 */

module.exports = function(){
    var queue = [];

    var service = {};

    service.add = function(value){
        queue.push(value);
    };

    service.remove = function(){
        return queue.shift();
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