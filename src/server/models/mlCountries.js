const mongoose = require('mongoose');

const MlCountriesSchema =  mongoose.Schema({

    country :
    {
        type : String,
        optional : false
    },

    countryCode :{
        type : String,
        optional : false
    },

    displayName :{
        type : String,
        optional : false
    },

    about :{
      type : String,
      optional : true
    },

    capital :{
      type : String,
      optional : true
    },

    url :{
        type : String,
        optional : true
    },
    isActive:{
        type: Boolean,
        optional:true
    },
    phoneNumberCode:{
      type:String,
      optional:true
    },
    status:{
        type: String,
        optional:true
    }
})
module.exports = mongoose.model('MlcCountries', MlCountriesSchema,"mlcCountries");