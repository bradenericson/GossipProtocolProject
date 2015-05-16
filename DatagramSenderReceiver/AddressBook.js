/**
 * Created by braden on 5/16/15.
 *
 *      Chad, Braden, Matt
 *
 *      Class Variables:
 *          address = []
 *              holds X amount of addresses for sending
 *
 *      Methods:
 *          service.addAddress = function(address)
 *              add an address to the address book
 *
 *          service.getAddress = function(index)
 *              return the address of a specific index
 *
 *          service.getAddresses = function()
 *              returns the addresses class variable
 *
 *          service.removeAddress = function(index)
 *              remove and specific address
 *
 *          service.clearAddressBook = function()
 *              clears the address book
 *
 *          service.getLength = function()
 *              returns the length of the address book
 *
 *      Modification History
 *          Original Version
 *              May 16 2015
 */

module.exports = function(){
  var addresses = [];

    var service = {};

    //add an address to the address book
    service.addAddress = function(address){
        addresses.push(address);
    };

    //return the address of a specific index
    service.getAddress = function(index){
        return addresses[index];
    };

    //returns the addresses class variable
    service.getAddresses = function(){
        return addresses;
    };

    //remove and specific address
    service.removeAddress = function(index){
        return addresses.splice(index, 1);
    };

    //clears the address book
    service.clearAddressBook = function(){
        addresses = [];
    };

    //returns the length of the address array
    service.getLength = function(){
        return addresses.length;
    };

    return service;
};