const mongoose = require('mongoose');

const MlCitizenshipSchema = mongoose.Schema({
  citizenshipTypeName:{
    type:String,
    optional:false
  },
  citizenshipTypeDisplayName:{
    type:String,
    optional:true
  },
  about:{
    type: String,
    optional:true
  },
  createdBy:{
    type:String,
    optional: true
  },
  createdDate:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional: true
  },
  updatedDate:{
    type:Date,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }
})
module.exports = mongoose.model('MlcCitizenship', MlCitizenshipSchema,"mlcCitizenship");