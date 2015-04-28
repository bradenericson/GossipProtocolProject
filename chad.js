/**
 * Created by braden on 4/23/15.
 */
var IDFactory = require('./ID/IDFactory.js');

var test = new IDFactory();
var idFactory = new IDFactory();

idFactory.generateId();
var newId = idFactory.idFactory();

console.log(newId.id);