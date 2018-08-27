var mongoose = require('mongoose');
const {MlcAuditSchema} = require('./mlcAudit');

var MlcEmailTemplatesSchema = mongoose.Schema ({
    templateName : { type : String },
    fromID : { type : String },
    subject : { type : String },
    bodyContent : { type : String},
    isActive : { type : Boolean},
    audit : MlcAuditSchema,
    templateFor : { type : String } //"WHITELIST_1"
})


module.exports = mongoose.model ('MlcEmailTemplates',MlcEmailTemplatesSchema, 'mlcEmailTemplates')