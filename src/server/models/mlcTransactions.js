var mongoose = require('mongoose');

var MlcTransactionsSchema = mongoose.Schema({
    emailId: {type: String},
    regRecId: {type: String},
    ethTransfered: {type: String},
    txHash: {type: String},
    dateOfTransfer : {type: String},
    createdAt: {type: Date},
    termsAndConditions : mongoose.Schema.Types.Mixed
});

//Export model
module.exports = mongoose.model('MlcTransactions', MlcTransactionsSchema,'mlcTransactions');