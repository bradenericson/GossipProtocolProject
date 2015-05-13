/**
 * Created by braden on 5/12/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ResourceSchema   = new Schema({
    name: String,
    description: String,
    tags: Array,
    location: String,
    mimeType: String,
    size: Number
});

module.exports = mongoose.model('Resource', ResourceSchema);