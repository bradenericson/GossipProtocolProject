/**
 * Created by braden on 5/16/15.
 */

module.exports = function(){
  var addresses = [];

    var service = {};

    service.addAddress = function(address){
        addresses.push(address);
    };

    service.getAddress = function(index){
        return addresses[index];
    };

    service.getAddresses = function(){
        return addresses;
    };

    service.removeAddress = function(index){
        return addresses.splice(index, 1);
    };

    service.clearAddressBook = function(){
        addresses = [];
    };

    service.getLength = function(){
        return addresses.length;
    };

    return service;
};