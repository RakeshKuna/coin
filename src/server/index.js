const express = require('express');
var moment = require('moment');
const https = require("https");
const fs = require('fs');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('dist'));
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());
//app.use('/public', express.static('/public'));

const _ = require('underscore');
const path = require('path');

//Set up postgresql connection
const DBConnection = require('./mlcDbConfig');

const MlcTransactionMethods = require('./methods/mlTransactions.methods');
const MlcEmailTemplatesMethods = require('./methods/mlEmailTemplates.methods');
const MlcCountriesMethods = require('./methods/mlcCountries.methods');
const MlcSecondaryRegistrationMethods = require('./methods/mlcSecondaryRegistrations.methods');
const MlcRegistrationDetailsMethods = require('./methods/mlcRegistrationDetails.methods');
const MlcUsersMethods = require('./methods/mlcUsers.methods');
const MlcEMailsMethods = require('./methods/mlcEmails.methods');
const MlcTransactionsTokenAssignmentMethods = require('./methods/mlcTransactionsTokenAssignments.methods');

const MlcEmails = require('./email');

const MlcSchedulers = require('./schedulers/mlcSchedulers');


app.post('/api/saveWhitelistFormDetails',async function(req,res){
    var wtDetails = req.body;
    var whiteList = await MlcTransactionMethods.saveTransactionDetails(wtDetails);

    if(whiteList && whiteList.status && whiteList.status === "SUCCESS"){
        MlcEmails.sendTransferThankYouEmail({
            to: wtDetails.emailId,
            firstName: ''
        });
    }
    return res.send(whiteList);
});

app.post('/api/getETHDetails',async function(req,res){
    var details = req.body
    var transactionDetails = await MlcTransactionMethods.getTransactionDetails(details);
    var totalNumberOfRows = await MlcTransactionMethods.getTotalNumberOfRecords()
    var pendingListCount = await MlcTransactionMethods.getPendingListCount();
    var whiteListCount = await MlcRegistrationDetailsMethods.getTotalRecordCount("1");
    var submittedSum = await MlcTransactionMethods.getSumOfSubmittedValues();
    transactionDetails = _.extend(transactionDetails, totalNumberOfRows, pendingListCount, whiteListCount, submittedSum);

    return res.send(transactionDetails)
});

app.post('/api/updateTransactionDetails',async function (req,res) {
    var transactionDetails = req.body;
    var updatedTransactionDetails = await MlcTransactionMethods.updateTransactionDetails(transactionDetails);
    var pendingListCount = await MlcTransactionMethods.getPendingListCount();

    var finalResp = {};
    finalResp = _.extend(updatedTransactionDetails, pendingListCount);
    return res.send(finalResp);
});


app.post('/api/getTransactionDetailsForPagination',async function(req,res){
    var requestedDetails = req.body;
    var transactionDetails = await MlcTransactionMethods.getTransactionDetails(requestedDetails)
    return res.send(transactionDetails)
});

app.post('/api/exportCSVTransactionDetails', async function (req, res) {
    var totalTransactions = await MlcTransactionMethods.getTransactionDetailsToBeExported();
    return res.send(totalTransactions);
})

app.post('/api/saveEmailTemplate', async function (req, res) {
    var emailDetails = req.body;
    var emailTemplates = '';
    if(emailDetails && emailDetails.tempId){
        emailTemplates = await MlcEmailTemplatesMethods.updateEmailTemplateDetails(emailDetails)
    }
    else{
        emailTemplates = await MlcEmailTemplatesMethods.saveEmailTemplateDetails(emailDetails);
    }

    return res.send(emailTemplates)
});

app.post('/api/saveAndSendEmailTemplate',async function(req,res){
    var emailDetails = req.body;
    var emailTemplates = '';
    if(emailDetails && emailDetails.tempId){
        emailTemplates = await MlcEmailTemplatesMethods.updateEmailTemplateDetails(emailDetails)
    }
    else{
        emailTemplates = await MlcEmailTemplatesMethods.saveEmailTemplateDetails(emailDetails);
    }

        //Send Email.

    if(emailDetails.templateFor && emailDetails.templateFor!="NONE" && emailTemplates && emailTemplates.status && emailTemplates.status === "SUCCESS" && emailTemplates.templateData && emailTemplates.templateData.tempId){

        MlcEMailsMethods.EmailFormatter_SendEmailTemplate(emailTemplates.templateData.tempId);
    }


    return res.send(emailTemplates)
});


app.get('/api/getEmailTemplatesList', async function (req, res) {
    var templateDetails = await MlcEmailTemplatesMethods.getEmailTemplateList();
    return res.send(templateDetails)
});


app.post('/api/getEmailTemplateData', async function (req, res) {
    var templateDetails = req.body;
    var templateData = await MlcEmailTemplatesMethods.getEmailTemplateDetails(templateDetails);
    //console.log("Template Details :", templateData)
    return res.send(templateData)
});


app.get('/api/statusesCounts', async function(req,res){
    var respObj = {};

    var resp1 = await MlcRegistrationDetailsMethods.getTotalRecordCount("0");

    if(resp1 && resp1.status && resp1.status === "SUCCESS"){
        respObj = _.extend(respObj,{"QUEUE": resp1.statusCount});
    }

    var resp2 = await MlcRegistrationDetailsMethods.getTotalRecordCount("1");

    if(resp2 && resp2.status && resp2.status === "SUCCESS"){
        respObj = _.extend(respObj,{"WHITE": resp2.statusCount});
    }

    var resp3 = await MlcRegistrationDetailsMethods.getTotalRecordCount("2");

    if(resp3 && resp3.status && resp3.status === "SUCCESS"){
        respObj = _.extend(respObj,{"HOLD": resp3.statusCount});
    }

    var resp4 = await MlcRegistrationDetailsMethods.getTotalRecordCount("3");

    if(resp4 && resp4.status && resp4.status === "SUCCESS"){
        respObj = _.extend(respObj,{"BLACK": resp4.statusCount});
    }

   return res.send({"countsData" : respObj,"status" : "SUCCESS"});
});


app.get('/api/getCountriesList', async function (req, res) {
    var listResp = await MlcCountriesMethods.getCountriesList();
    res.send(listResp);
});

app.post("/api/saveSecondaryRegistrationDetails",async function(req, res){

    var saveResp = await MlcSecondaryRegistrationMethods.saveRegistrationDetails(req.body);

    if(saveResp && saveResp.status && saveResp.status === "SUCCESS"){
        var emailDt = req.body;
        emailDt.countryName = '';

        var countryDt = await MlcCountriesMethods.getCountryInfo(emailDt.countryId);

        if(countryDt && countryDt.displayname){
            emailDt.countryName = countryDt.displayname;
        }

        MlcEmails.sendRegistrationDetails(emailDt);
        MlcEmails.sendSecondaryRegistrationEmail({"firstName": emailDt.Name,"to": emailDt.emailId});
    }
    res.send(saveResp);

});

app.post('/api/createUser', async function (req, res) {
    var reqDt = req.body || {};
    var userdetails = await MlcUsersMethods.createUser(reqDt);
    res.send(userdetails);
});

app.post('/api/login', async function (req, res) {
    var reqDt = req.body || {};
    var userlogin = await MlcUsersMethods.userLogin(reqDt);
   res.send(userlogin);
  // console.log(userlogin);
});

app.post('/api/logout', async function (req, res) {
    res.send({status: "SUCCESS", message: "Logout successfully"});
   

});

app.post('/api/resetpassword',async function(req,res){
    var reqDt =req.body;
    var updatedDetails = await MlcUsersMethods.resetPassword(reqDt);
    res.send(updatedDetails);
});

app.post('/api/getRegistrationDetailsCustom', async function (req, res) {
    var reqData = req.body;
    reqData.recordStatus = '';

    if(reqData.reqStatus && reqData.reqStatus!=''){
        switch(reqData.reqStatus){
            case 'QUEUE':   reqData.recordStatus = '0';  break;
            case 'WHITE':   reqData.recordStatus = '1';  break;
            case 'HOLD':    reqData.recordStatus = '2';  break;
            case 'BLACK':   reqData.recordStatus = '3';  break;
        }
        
        reqData.limit = 1;

        var finalResp = {};
        finalResp = await MlcRegistrationDetailsMethods.getRegistrationRecordDetails(reqData);

        if(reqData.recordType === "FIRST"){
            var totalAmountObj = await MlcRegistrationDetailsMethods.getTotalAmountPerStatus(reqData.recordStatus);
            finalResp = _.extend(finalResp, totalAmountObj)
        }

        res.send(finalResp);

    }
});


app.post("/api/transferData",async function(req, res){
    var reqData = req.body;
    console.log("Request data is:",reqData);

    if(reqData && reqData.fileData){

            // Tokens register.
        var insertresp = await MlcTransactionsTokenAssignmentMethods.setTokensData(reqData.fileData);

        if(insertresp){
            console.log("Assignment start...");
            MlcTransactionsTokenAssignmentMethods.startAssignment();
        }

        console.log("After Insert:", JSON.stringify(insertresp));
            // Assignment.
        res.send({"status":"SUCCESS","message":"Assignment started, please wait."});
    }
    else{
        res.send({"status":"FAIL","message":"Something wrong, please try again"});
    }

});

app.post('/api/getTransferDetails',async function(req,res){
    var details = req.body;
    var transactionDetails = await MlcTransactionsTokenAssignmentMethods.getTransferDetails(details);

    if(details && details.dataForPage && details.dataForPage === "FIRST"){
        var totalNumberOfRows = await MlcTransactionsTokenAssignmentMethods.getTotalNumberOfRecords();
        transactionDetails = _.extend(transactionDetails, totalNumberOfRows);
    }

    return res.send(transactionDetails)
});


async function setCountriesList(){
    console.log("Iam in Countries list...");

    var MongoClient = require('mongodb').MongoClient;
    var url ="mongodb://localhost:27017";

    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("moolya_coin");
        console.log("Mongo Connection Success...");

        const clientCon = await DBConnection.getConnection();


        dbo.collection("mlcCountriesList").find({}).toArray(function(err, result){
        //console.log("Result is:",result);

            _.each(result,function(cntRec){
                if(cntRec && cntRec.displayName){
                    var phn = cntRec.phoneNumberCode? cntRec.phoneNumberCode : "";
                    var cntName = cntRec.displayName.replace("'","'\'");

                    var newRec = 'insert into mlcCountries("id","countrycode","displayname","isactive","phonenumbercode") values(' +
                        "'"+cntRec._id +"','"+cntRec.countryCode+"','"+cntName+"', 'true', '"+phn+"' )";

            //console.log("Query is:",newRec);

                    clientCon.query(newRec);

                }
            });

            console.log("List migration done.");

        });
    });


};

//setCountriesList();



console.log("NODE ENV is:", process.env.NODE_ENV);

var serverPort = process.env.PORT;

if (!serverPort && process.env.NODE_ENV) {
    console.log("Please set PORT number.");
    process.exit(0);
}
else {
    if (process.env.NODE_ENV === "production") {
        var privateKey = fs.readFileSync(__dirname + '/whitelist.key');
        var certificate = fs.readFileSync(__dirname + '/whitelist.cert');

        https.createServer({
            key: privateKey,
            cert: certificate
        }, app).listen(serverPort);
        console.log('PROD : Listening on port:', serverPort);

    }
    else if (process.env.NODE_ENV === "qa") {
        app.listen(serverPort, () => console.log('QA : Listening on port:', serverPort));
    }
    else {
        serverPort = 8080;
        app.listen(serverPort, () => console.log('DEV : Listening on port:', serverPort));
    }


    process.title = 'node-process-' + process.env.NODE_ENV;
    console.log('This process is your pid:' + process.pid);
    console.log('This process Title:' + process.title);

    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "qa") {

            // This will handle every request to the server and works as per conditions:
        app.get('*', function(request, response, next) {

            var currUrl = request.originalUrl;
            //console.log("Request is:",currUrl);

            if(currUrl.includes("/api/")){  // to bypass API calls.
                next();

            }
            else if(currUrl.includes("/getclicky/")){ // to bypass external URL i.e. page views code.
                //console.log("In Clicky..");
                next();
            }
            else{   // to remaining all.
                var locPath = path.join(__dirname,'/../../dist/index.html');
                //console.log("Path is:",locPath);

                response.sendFile(locPath);
            }
        });

    }
}


async function callSchedulers(){
    await MlcSchedulers.emailsScheduler();
    // MlcSchedulers.dailyReport();
};

//callSchedulers();

