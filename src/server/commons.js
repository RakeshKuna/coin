const fs = require('fs');
const _  = require('underscore');

const getDocFile = function (fileFor) {
    var filePath = '';
    var fileName = '';

    if(fileFor && fileFor === "MLC_STC"){
        filePath = 'dist/documents/moolyacoin_STC/';

        var stcFilesAre = [];
        fs.readdirSync(filePath).forEach(file => {
            //console.log(file);
            stcFilesAre.push(file);
        });

        fileName  = stcFilesAre[0];
    }
    else{

    }

    return {"filePath": filePath,"fileName": fileName};
};

const mlcSourceOfFundsList = [

    {
        code: "SUBSIDIES",
        displayName: "Subsidies",
    },
    {
        code: "CREDIT",
        displayName: "Credit",
    },
    {
        code: "VENTURE_CAPITAL",
        displayName: "Venture capital",
    },
    {
        code: "DONATIONS",
        displayName: "Donations",
    },
    {
        code: "GRANTS",
        displayName: "Grants",
    },
    {
        code: "TAXES",
        displayName: "Taxes",
    },
    {
        code: "SAVINGS",
        displayName: "Savings",
    },

];


const mlcGenderList = [
    {
        code: "MALE",
        displayName: "Male"
    },
    {
        code: "FEMALE",
        displayName: "Female"
    },
    {
        code: "OTHERS",
        displayName: "Others"
    },

]


const getItemFromList = function(itemsList, queryObject){
    var respObj = {};
    if(itemsList && itemsList.length> 0 && queryObject){

        var keys = Object.keys(queryObject);
        var match = false;

        var foundIndex = itemsList.findIndex(function(itemRec){
            if(itemRec){

                _.each(keys,async function(keyItem,keyIndex){

                    if(itemRec[keyItem]!=undefined && itemRec[keyItem] == queryObject[keyItem]){
                        match = true;
                    }
                    else {
                        match = false;
                        keyIndex = keys.length;
                    }
                });
                if(match){
                    return itemRec
                }
            }
        });

        if(foundIndex > -1){
            respObj =  itemsList[foundIndex];
        }
    }

    return respObj;
};

module.exports = {getDocFile, mlcSourceOfFundsList, getItemFromList, mlcGenderList};