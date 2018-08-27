const DBConnection = require('../mlcDbConfig');
var moment = require('moment');
var randomId = require('random-id');

var saveEmailTemplateDetails = async function(emailDetails){
    var response = {};
    var Id = randomId(15);
  var emailDetails = 'INSERT INTO "mlcEmailTemplates" ("tempId","templateName", "fromID", "subject", "bodyContent", "createdAt", "createdBy", "templateFor") VALUES  ' +
      "('"+Id+"','"+emailDetails.templateName+"','"+emailDetails.fromID+"', '"+emailDetails.subject+"' ,'"+emailDetails.bodyContent+"','"+moment().toDate()+"','"+emailDetails.userId+"'," +"'"+emailDetails.templateFor+"'"+
      ")"
    const client = await DBConnection.getConnection();
    var result =   await client.query(emailDetails);
    //console.log("New Rec:",result);

    if(!result){
        response = {"status": "FAIL", "message": "Please try again"}
    }
    else if(result && result.rowCount && result.rowCount == 1){
        response = {"status": "SUCCESS", "message": "Template saved successfully","templateData":{"tempId": Id}};
    }
    client.end()
    return response;

}

var getEmailTemplateList = async function(){
var result = {};
var emailList = ' SELECT "templateName","tempId" FROM "mlcEmailTemplates" WHERE "isActive" = true order by "createdAt"';
    const client = await DBConnection.getConnection();
    var response = await client.query(emailList);
    if(!response){
        result = {"status" : "FAIL", "message": result}
    }
    else{
        result = {"status" : "SUCCESS", "message": "Email Details", "templateData" : response.rows }
    }
    client.end();
    return result;

}


var getEmailTemplateDetails = async function(templateDetails) {
    var data = {};
    var emailTemplateData = 'SELECT * FROM "mlcEmailTemplates" WHERE ' +
        '"tempId" =' +
        " '"+templateDetails.tempId+"'";
    //console.log("QUERY:",emailTemplateData);
    const client = await DBConnection.getConnection();
    var resp = await client.query(emailTemplateData);
    if(!resp){
        data = {"status" : "FAIL", "message": data}
    }
    else{
        data = {"status" : "SUCCESS", "message": "Email Details", "templateData" : resp.rows[0] }
    }
    client.end();
    return data;
}


var updateEmailTemplateDetails = async function(emailTemplateDts){
    //console.log("Updated Details:",emailTemplateDts);
    var detailsStatus = {};
    if(emailTemplateDts && emailTemplateDts.tempId){
        var updatedTemplate = 'UPDATE "mlcEmailTemplates" SET  ' +
            '"templateName" = ' +
          "'"+emailTemplateDts.templateName+"'" +
            ' ,"fromID"= ' +
            "'"+emailTemplateDts.fromID+"'"+
            ',"subject" = ' +
            "'"+emailTemplateDts.subject+"'" +
            ',"bodyContent" = ' +
            "'"+emailTemplateDts.bodyContent+"'" +
            ',"updatedAt"=' +
            "'"+moment().toDate()+ "'" +
            ' ,"updatedBy" = ' +
            "'"+emailTemplateDts.userId+"'" +
            ', "templateFor" ='+
            "'"+ emailTemplateDts.templateFor+"'"+
            ' WHERE ' +
            '"tempId" =' +
            " '"+emailTemplateDts.tempId+"'";

        const client = await DBConnection.getConnection();
        var response = await client.query(updatedTemplate);
       if(!response){
           detailsStatus = {"status" : "FAIL", "message": "Please try again"}
       }

       else if(response.rowCount>=0){
           var tempDataQuery = 'SELECT * FROM "mlcEmailTemplates" WHERE ' +'"tempId" =' +" '"+emailTemplateDts.tempId+"'";
           var tempDataRecs = await client.query(tempDataQuery);

           detailsStatus = {"status" : "SUCCESS", "message": "Template Details Updated Successfully", "templateData" : tempDataRecs.rows[0]};
       }

        client.end();
        return detailsStatus;
    }

};

module.exports = { saveEmailTemplateDetails, getEmailTemplateList, getEmailTemplateDetails, updateEmailTemplateDetails }