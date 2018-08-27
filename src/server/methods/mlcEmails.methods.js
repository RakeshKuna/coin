const DBConnection = require('../mlcDbConfig');
var moment = require('moment');
const _ = require('underscore');
var handlebars = require('handlebars');

const MlcEmails = require('../email');


async function EmailFormatter_SendEmailTemplate(tempId){
    var dataQuery = 'SELECT * FROM "mlcEmailTemplates" WHERE ' +
        '"tempId" =' +
        " '"+tempId+"'";

    const client = await DBConnection.getConnection();
    var dataRows = await client.query(dataQuery);

    if(dataRows && dataRows.rows && dataRows.rows[0]){

        var tempRec = dataRows.rows[0];

            // Get the users list matching with status of 'templateFor'.
        var recordStatus = '';

        switch(tempRec.templateFor){
            case 'QUEUE':   recordStatus = '0';  break;
            case 'WHITE':   recordStatus = '1';  break;
            case 'HOLD':    recordStatus = '2';  break;
            case 'BLACK':   recordStatus = '3';  break;
        }

        var replacements = [];
        var checkFor = ["{{FIRST_NAME}}","{{FULL_NAME}}"];


        if(tempRec.bodyContent){
            _.each(checkFor,async function(checkRec){
                if(checkRec){
                    var i2 = tempRec.bodyContent.indexOf(checkRec);

                    if(i2>=0){
                        replacements.push(checkRec);
                    }
                }
            });
        }
        //console.log("Found repls:",replacements);

        var dataQuery = {};
        if(replacements && replacements.length>0){
                    // Query with joins.
            dataQuery = "SELECT t1.email ";

            _.each(replacements,async function(repRec){
                switch(repRec){
                    case "{{FIRST_NAME}}":  dataQuery+=', t1.first_name'; break;
                    case "{{FULL_NAME}}":  dataQuery+=', t1.first_name, t1.last_name'; break;
                }
            });

            dataQuery+=' from users t1 inner join user_details t2 on t1.id=t2.user_id inner join user_status t3 on t2.user_id=t3.user_id and t3.kyc_status='+recordStatus
        }
        else{
            dataQuery = 'SELECT t1.email from users t1 inner join user_details t2 on t1.id=t2.user_id inner join user_status t3 on t2.user_id=t3.user_id and t3.kyc_status='+recordStatus;
        }

        //console.log("Query is:",dataQuery);
        var usersData = await client.query(dataQuery);

        if(usersData && usersData.rows && usersData.rows.length>0){

            _.each(usersData.rows,async function(userRec){
                if(userRec.email){

                    var emailBodyContent = handlebars.compile(tempRec.bodyContent);

                    if(replacements && replacements.length>0){

                            // Replace constants here.
                        var replObj = {};

                        _.each(replacements,async function(repRec){
                            switch(repRec){
                                case "{{FIRST_NAME}}":  replObj["FIRST_NAME"]= userRec.first_name; break;
                                case "{{FULL_NAME}}":  replObj["FULL_NAME"]= userRec.first_name+" "+userRec.last_name; break;
                            }
                        });

                        emailBodyContent = emailBodyContent(replObj);
                    }

                            //  Send Email.
                    await MlcEmails.sendEmailCustomTemplate1({"emailTo": userRec.email, "emailContent": emailBodyContent,"emailSubject": tempRec.subject})

                }
            });
        }


    }
}

module.exports = {EmailFormatter_SendEmailTemplate};