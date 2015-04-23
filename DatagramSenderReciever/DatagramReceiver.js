/**
 * Created by braden on 4/23/15.
 */

module.exports = function() {
    var service = {};

    service.sayHelloInEnglish = function() {
        return "HELLO";
    };

    service.sayHelloInSpanish = function() {
        return "Hola";
    };

    return service;
};