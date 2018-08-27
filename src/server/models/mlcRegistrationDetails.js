var mongoose = require('mongoose');
const MlcAuditSchema = require('./mlcAudit');
var moment = require('moment');

var MlcDocsSchema = mongoose.Schema({
    docFileName : {type: String},
    docType: {type: String},
    audit: MlcAuditSchema
},{ _id : false });

var MlcKYCDocSchema = mongoose.Schema({
    preference : {type: String},
    docType: {type: String},
    audit: MlcAuditSchema
},{ _id : false });

var MlcRegistrationDetailsSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    gender: {type: String},
    contactNumber: {type: String},
    countryId: {type: String},
    cityId: {type: String},
    citizenshipId: {type: String},
    address_1: {type: String},
    address_2: {type: String},
    emailId: {type: String},
    ethValue : {type: String},
    comments : {type: String},
    isActive: {type: Boolean, default : true},
    KYCDocsInfo: [MlcKYCDocSchema],
    documentsList : [MlcDocsSchema],    // PASSPORT, DRV_LIC.
    createdAt :{type: Date, }, //default: moment().toDate()
    status : {type: String, default :"QUEUE"},  // QUEUE, WHITE, BLACK, HOLD, ADDL_INFO.
    statusAudit : [
                     { status: {type: String}, createdAt: {type: Date}, createdBy : {type: String}}
                    ],
    termsAndConditions : mongoose.Schema.Types.Mixed,
    MLC_Id : {type: String},
    dateOfBirth : {type: Date},
    sourceOfFunds : {type: String},

});

module.exports = mongoose.model('MlcRegistrationDetails', MlcRegistrationDetailsSchema,'mlcRegistrationDetails');