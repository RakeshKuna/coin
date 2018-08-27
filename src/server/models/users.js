const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    name: {type: String},
    username: {type: String, required: true},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    createdAt :{type: Date},
    isLoggedIn : {type: Boolean, default: false}
});


module.exports = mongoose.model('Users', UsersSchema,"mlcUsers");