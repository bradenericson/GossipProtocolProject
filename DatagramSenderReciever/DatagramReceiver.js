/**
 * Created by braden on 4/23/15.
 */

module.exports = function() {
    var service = {};
    var privateVariable = "This is a private variable";
    service.sayHelloInEnglish = function() {
        return "HELLO";
    };

    service.sayHelloInSpanish = function() {
        return "Hola";
    };

    service.instanceVariable = "This is an instance variable";

    return service;
};