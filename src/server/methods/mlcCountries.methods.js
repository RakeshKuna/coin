const DBConnection = require('../mlcDbConfig');

async function getCountriesList(){
    var resp = {};
    var countriesQuery = "SELECT * FROM mlccountries WHERE isactive='true' ORDER BY displayname ";
    const clientCon = await DBConnection.getConnection();

    var responseList = await clientCon.query(countriesQuery);

    if(responseList && responseList.rows && responseList.rows.length>0){
        resp = {"countriesList": responseList.rows,"status":"SUCCESS"};

    }
    else{
        resp = {"status" : "FAIL", "message": "Something wrong."}
    }

    return resp;

};

async function getCountryInfo(countryId){
    var resp = {};
    var selQuery = "SELECT * FROM mlccountries WHERE id='"+countryId+"'";

    const clientCon = await DBConnection.getConnection();

    var responseInfo = await clientCon.query(selQuery);

    if(responseInfo && responseInfo.rows && responseInfo.rows.length>0){
        resp = responseInfo.rows[0];
    }
    clientCon.end();
    return resp;
}

module.exports= {getCountriesList, getCountryInfo};