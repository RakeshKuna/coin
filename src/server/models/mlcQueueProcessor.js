var mongoose = require('mongoose');

const MlcQueueProcessorSchema = new mongoose.Schema({
    userId: {type: String},
    regRecId: {type: String},
    createdAt: {type: Date},
});

module.exports = mongoose.model('MlcQueueProcessor', MlcQueueProcessorSchema,'mlcQueueProcessor');