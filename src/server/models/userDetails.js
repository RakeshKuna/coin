var mongoose = require('mongoose');
var checkSchema = mongoose.Schema({
     name : {type: String},
     age: {type: Number}
});

var UserDetailsSchema = mongoose.Schema({
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    list : [checkSchema],
});

//Export model
module.exports = mongoose.model('UserDetails', UserDetailsSchema,'userDetails');