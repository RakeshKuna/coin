var mongoose = require('mongoose');
var MlcSequencesSchema = mongoose.Schema({
    sequenceFor : {type: String},
    sequenceNumber: {type: String}
});

module.exports = mongoose.model('MlcSequences', MlcSequencesSchema,'mlcSequences');