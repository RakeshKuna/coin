const DBConnection = require('../mlcDbConfig');
var randomId = require('random-id');
var moment = require('moment');


async function saveRegistrationDetails(regData){
    var resp = {};
    const clientCon = await DBConnection.getConnection();
    var recId = randomId(15);

    var newRec = 'INSERT INTO mlc_secondary_registrations("id","name","emailid","countryid","contactnumber","createdat") VALUES(' +
            "'"+recId+"', '"+ regData.Name+"', '"+ regData.emailId+"', '"+regData.countryId+"', '"+regData.contactNumber+"', '"+moment().toDate()+"' )";

    var newRecSave = await clientCon.query(newRec);

    if(newRecSave && newRecSave.rowCount && newRecSave.rowCount == 1){
        resp = {"status": "SUCCESS", "message": "Registration success"};
    }
    else{
        resp = {"status": "FAIL", "message": "Please try again."};
    }
    clientCon.end();

    return resp;
}

module.exports = {saveRegistrationDetails};