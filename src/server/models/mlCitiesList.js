const mongoose = require('mongoose');

const MlCitiesListSchema = mongoose.Schema({

  name :{
    type : String,
    optional : false
  },
  stateId :{
    type : String,
    optional : false
  },
  countryId :{
    type : String,
    optional : false
  },
  countryCode :{
    type : String,
    optional : false
  },
  displayName :{
    type : String,
    optional : true
  },
  about :{
    type : String,
    optional : true
  },
  isActive:{
    type: Boolean,
    optional:true
  }
})
module.exports = mongoose.model('MlcCitiesList', MlCitiesListSchema,"mlcCitiesList");
