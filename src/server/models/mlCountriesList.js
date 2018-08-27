const mongoose = require('mongoose');

const MlCountriesListSchema =  mongoose.Schema({

    country :
    {
        type : String,
    },

    countryCode :{
        type : String,
    },

    displayName :{
        type : String,
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
module.exports = mongoose.model('MlcCountriesList', MlCountriesListSchema,"mlcCountriesList");