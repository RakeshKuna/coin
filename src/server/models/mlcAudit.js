var mongoose = require('mongoose');

var MlcAuditSchema = mongoose.Schema({
    createdAt : {type: Date},
    createdBy : {type: String},
    updatedAt : {type: Date},
    updatedBy : {type: String}
},{ _id : false });

module.exports= {MlcAuditSchema};