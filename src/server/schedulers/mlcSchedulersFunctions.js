var moment = require('moment');
const _ = require('underscore');
var cron = require('node-cron');
var async = require("async");
var nodemailer = require('nodemailer');
var smtpTransporter = require('nodemailer-smtp-transport');
var fs = require('fs');
var handlebars = require('handlebars');


const DBConnection = require('./../mlcDbConfig');
const MlcEmails = require('./../email');

var readHTMLFileSync = async function (path) {
    var fileRead = fs.readFileSync(path);
    return "" + fileRead;
};

async function Email_Task1_SendEmailTemplates(atTime){
    var cuurTime = moment(atTime).format("HH:mm:ss A");
    console.log(" Task -1 Scheduler:",cuurTime);
    var k = ["AB", "CD"];

    _.each(k, async function(rec,recIndex){
        if(rec){
            setTimeout(async function(){
                console.log("Data is:",rec);
            },65000);
        }
    });

    console.log("Task:"+moment(atTime).format("HH:mm:ss A")+" Runs till:",moment(moment().toDate()).format("HH:mm:ss A"));
};

async function Email_Task1_SendRegistrationSuccess(dateTime) {
    var currIndex = 0;
    var listofemails = [];
    var self = this;


    try {
        var currTime = moment(dateTime).format("HH:mm:ss A");
        console.log(" Task -1 Scheduler:", currTime);

        var clientCon = await DBConnection.getConnection();
        var regQuery = "select users.email as emailid,users.first_name,users.id as userid,user_status.id as userstatusid from users inner join user_status on (users.id = user_status.user_id and kyc_status='0' and reg_email_sts='NO')";

        var reQurRes = await clientCon.query(regQuery);
        //console.log("Records are:", reQurRes.rows);
        listofemails = reQurRes.rows;

                // Sending email to first record only here.

        await SendEmailTo(listofemails[0], {});

        //console.log("All mails completed...");

        //console.log("Task:" + currTime + " Runs till:", moment(moment().toDate()).format("HH:mm:ss A"));
        clientCon.end();
    }
    catch (e) {
        console.log("Exception in Task-1 Scheduler:", e);
    }


    async function SendEmailTo(emailProps) {

        if (emailProps && emailProps.emailid) {


            var smtpTransport = nodemailer.createTransport(smtpTransporter({
                service: 'raksan',
                host: '10.0.2.26',
                secure: false,
                // ssl : false,
                port: 25,
                // auth: {
                //     user: 'icocoin@moolyacoin.io',
                //     pass: 'raksan123'
                // },
                tls: {
                    rejectUnauthorized: false
                }
            }));

            console.log("Sending Registration .Email to " + emailProps.emailid);

            emailProps.status = false;

            async.waterfall([
                function (callback) {
                    var html = "" + fs.readFileSync(__dirname + '/../email_templates/newRegistrationReceived.html');
                    var template = handlebars.compile(html);
                    var replacements = {
                        FirstName: emailProps.first_name,
                        //UniqueId : req.UniqueId
                    };
                    var htmlToSend = template(replacements);

                    var mailOptions = {
                        from: 'no-reply@moolyacoin.io',
                        to: emailProps.emailid,
                        subject: ' Registration successful',   //: Unique-ID: ' + req.UniqueId

                        //subject: 'Hi ! Your ID:' + emailProps.userid,
                        //text: "Hello World !"
                        html: htmlToSend,
                    };
                    //console.log("Email Sent:", moment(moment().toDate()).format("HH:mm:ss A"));
                    emailProps.callbackMsg = '';

                    smtpTransport.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            emailProps.callbackMsg = error;
                        } else {
                            //console.log("Email Resp:", moment(moment().toDate()).format("HH:mm:ss A"));
                            emailProps.status = true;
                            emailProps.callbackMsg = info;
                        }
                        callback(null, emailProps);
                    });
                },
                function (emailProps, callback) {
                    // console.log("In S-1 Callback..");
                    // console.log("Will update DB here for " + emailProps.emailid + " of ID:" + emailProps.userid + " With " + emailProps.status);
                    updateEmailStatus(emailProps);
                    //console.log("Update done..");

                    callback(emailProps);
                }
            ], function (emailProps, callback) {
                //When everything is done return back to caller.
                //console.log("At last for current iteration:", emailProps);

                        // To send emails to remaining recipients.
                sendNextEmails(emailProps, callback);

                /*console.log("Next to Email of : ", emailProps.emailid);
                if (currIndex >= listofemails.length) {
                    console.log("At last of next...");
                    //callback();
                }*/
                //callback();
            });
        }
    }


    sendNextEmails = async function (emailProps, callback) {
        //console.log("Done for:",emailProps.emailid," && Sts:",emailProps.status);
        currIndex++;
        var self = this;

        if (currIndex < listofemails.length) {
            //console.log("Calling with Index:", currIndex);
            await SendEmailTo(listofemails[currIndex], function () {
                //console.log("B - In Next fun....");
                callback();
            });
        }
        else {
            //console.log("All Done...");
            //callback();
        }

    };
};


async function updateEmailStatus(emailProps) {
    //console.log("Status for:" + emailProps.emailid + " is:" + emailProps.status);
    var empResp = emailProps.callbackMsg;

    var clientCon = await DBConnection.getConnection();
    if (empResp && empResp.accepted && empResp.envelope) {
        //console.log("SUCCESS Sts update..");

        var updUserSts = "UPDATE user_status set reg_email_sts ='SUCCESS', reg_email_resp='" + JSON.stringify(empResp.envelope) + "' WHERE id='" + emailProps.userstatusid + "'";
        //console.log("Upd Query:", JSON.stringify(updUserSts));

        var updResp = await clientCon.query(updUserSts);

        if (updResp && updResp.rowCount && updResp.rowCount === 1) {
            //console.log("Update success..");
        }
        else {
            //console.log("Update failed..");
        }
    }
    else {
        //console.log("FAIL Sts update..");

        var updUserSts = "UPDATE user_status set reg_email_sts ='FAIL', reg_email_resp='" + JSON.stringify(empResp.rejectedErrors) + " ' WHERE id='" + emailProps.userstatusid + "'";

        var k = await clientCon.query(updUserSts);
    }
    clientCon.end();

}


module.exports = {Email_Task1_SendRegistrationSuccess};