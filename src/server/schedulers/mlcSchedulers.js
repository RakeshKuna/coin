var cron = require('node-cron');
var moment = require('moment');
const _ = require('underscore');
const MlcRegistrationDetails = require('../models/mlcRegistrationDetails');
const MlcCountriesList = require('../models/mlCountriesList');
const MlcCitiesList = require('../models/mlCitiesList');
const MlcConfigurations = require('../commons')
const EmailConfig = require('../email');
const MlcSchedulerFunctions = require("./mlcSchedulersFunctions");
var schedule = require('node-schedule');

const dailyReport = function () {
    cron.schedule('* * * * *', async function () {
        console.log('running a task every minute:', moment(moment().toDate()).format("HH:mm:ss A"));
        await sendNewUsersEmail(moment().toDate());
    });
};

const sendNewUsersEmail = async function (checkDate) {
    var usersDetails = await MlcRegistrationDetails.find({
        "createdAt": {
            $gte: moment(checkDate).startOf("day").toDate(),
            $lte: moment(checkDate).endOf("day").toDate()
        }
    })

    var countryIds = usersDetails.map((countryRec) => {
        return countryRec.countryId
    });
    countryIds = usersDetails.map((countryRec) => {
        return countryRec.citizenshipId
    });

    var countryData = await MlcCountriesList.find({"_id": {$in: countryIds}});
    //console.log("All Countries Data:",countryData);

    var cityIds = usersDetails.map((cityRec) => {
        return cityRec.cityId
    });

    var cityData = await MlcCitiesList.find({"_id": {$in: cityIds}});
    var currRow = "<div class='EMAIL_CLASS'><table border='1'>";
        //Table Headings
    currRow += "<thead><tr><th>MLC-Id</th><th>Created At</th><th>Name</th><th>Email-Id</th><th>Date Of Birth</th><th>Source Of Funds</th><th>Gender</th><th>Country</th><th>City</th><th>ETH Value</th></tr></thead>"
    _.each(usersDetails, async function (rec) {
        currRow += "<tr>";

        let dateOfBirth = moment(rec.dateOfBirth).format('DD/MM/YYYY');
        let createdAt = moment(rec.createdAt).format('DD/MM/YYYY');

        let sourceOfFunds = MlcConfigurations.mlcSourceOfFundsList;
        let gender = MlcConfigurations.mlcGenderList;

        let sourceOfFundsRec = {"displayName": "NA"};
        let cityRec = {"name": "NA"};
        let  countryRec = {"displayName" : "NA"};
        let genderRec = {"displayName" : "NA"};

        if (rec.sourceOfFunds) {
            sourceOfFundsRec = MlcConfigurations.getItemFromList(sourceOfFunds, {"code": rec.sourceOfFunds});
        }
        //console.log("Source Of Fund is:", sourceOfFundsRec);
        if(rec.countryId){
            countryRec = MlcConfigurations.getItemFromList(countryData,{"_id": rec.countryId});
        }

        if(rec.cityId){
            cityRec = MlcConfigurations.getItemFromList(cityData, {"_id": rec.cityId});
        }

        if(rec.gender){
             genderRec = MlcConfigurations.getItemFromList(gender,{"code" : rec.gender})
        }

        if (rec.MLC_Id) {
            currRow += "<td>" + rec.MLC_Id + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        if (rec.createdAt) {
            currRow += "<td>" + createdAt + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        if (rec.firstName) {
            currRow += "<td><b>" + rec.firstName + rec.lastName + "</b></td>"
        }
        else {
            currRow += "<td></td>"
        }

        if (rec.emailId) {
            currRow += "<td>" + rec.emailId + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        if (rec.dateOfBirth) {
            currRow += "<td>" + dateOfBirth + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        if (sourceOfFundsRec && sourceOfFundsRec.displayName) {

            currRow += "<td>" + sourceOfFundsRec.displayName + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        if (genderRec && genderRec.displayName) {
            // console.log("Gender:",genderRec.displayName)
            currRow += "<td>" + genderRec.displayName + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        //console.log("Country Data:", countryRec);
        if (countryRec && countryRec.displayName) {

            currRow += "<td>" + countryRec.displayName + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        //console.log("City Data:",cityRec)
        if (cityRec && cityRec.name) {
            currRow += "<td>" + cityRec.name + "</td>"
        }
        else {
            currRow += "<td></td>"
        }

        if (rec.ethValue) {
            currRow += "<td>" + rec.ethValue + "</td>"
        }
        else {
            currRow += "<td></td>"
        }
        currRow += "</tr>";
    });
    currRow += "</table></div>"
    //console.log("Mail Data:",currRow);
     EmailConfig.sendDailyReportEmail(currRow)
};

            // To send email to newly registered users.
const emailsScheduler = async function(){

        var rule = new schedule.RecurrenceRule();

        rule.minute = new schedule.Range(0, 59, 5); // Send email for every 5 minutes..
            //"*/1 * * * *"

        await schedule.scheduleJob(rule, async function(){
            try{
                //console.log('Email Scheduler task:', moment(moment().toDate()).format("HH:mm:ss A"));

               await MlcSchedulerFunctions.Email_Task1_SendRegistrationSuccess(moment().toDate());

                //console.log("--- END ---- ");
            }
            catch(e){
                console.log("Exception in Cron:",e);
            }
        });

};

const MlcTr = require("../methods/mlcTransactionsTokenAssignments.methods");

const statusUpdate = function () {
        console.log("Hello Mr.");
        cron.schedule('*/5 * * * *', async function () {
            console.log('Running a task every 5 minute:', moment(moment().toDate()).format("HH:mm:ss A"));
            await MlcTr.getTransHashStatus();
        });
};

module.exports = {dailyReport, emailsScheduler, statusUpdate};