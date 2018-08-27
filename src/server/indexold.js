const express = require('express');
var moment = require('moment');
const https = require("https");
const fs = require('fs');
var Q = require('q');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
// import MlcEmail from '/email.js'
var MlcEmail = require('./email')
app.use(bodyParser.json())

app.use(express.static('dist'));
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());
//app.use('/public', express.static('/public'));

const smtpTransport = require('./email');
const UserDetails = require('./models/userDetails');
const MlcRegistrationDetails = require('./models/mlcRegistrationDetails');
const MlcTransactions = require('./models/mlcTransactions');
const MlcQueueProcessor = require('./models/mlcQueueProcessor');
const MlcSequences = require('./models/mlcSequences');
const MlcEmailTemplates = require('./models/mlcEmailTemplates');


const MlcCountries = require('./models/mlCountries')
const MlcCities = require('./models/mlCities');
const MlcCountriesList = require('./models/mlCountriesList');
const MlcCitiesList = require('./models/mlCitiesList');
const MlcCitizenshipList = require('./models/mlCitizenShipList');
const MlcCitizenship = require('./models/mlCitizenship');
//const Commons = require('./commons');
const MlcSchedulers = require('./mlcSchedulers');
const _ = require('underscore');
var bcrypt = require('bcrypt');
const User = require('./models/users');
const request = require('request');
//var request = require('sync-request');

// Insert if no Sequence in list if not available.

MlcSequences.find({"sequenceFor": "REGISTRATION"}).exec(function (err, res) {
    //console.log("Seq Resp:",res);

    if (err) {
        console.log("Error in Registration Sequence:", err)
    }
    else {
        if (res && res.length > 0 && res[0] && res[0]._id) {
            console.log("Registration Sequence already there.")
        }
        else {
            var newSeqRec = new MlcSequences({"sequenceFor": "REGISTRATION", "sequenceNumber": "90000000"});
            var newSeqIns = newSeqRec.save();
            if (newSeqIns) {
                console.log("Registration Sequence added.");
            }
        }
    }
});


app.get('/api/getUsername', function (req, res) {
    res.send({username: "Moolya Coins - WhiteList..."});
    var listOfSts = [{"name": "ABC", "age": 21}, {"name": "DEF", "age": 23}, {"name": "GHI", "age": 22}]
    var newUser = new UserDetails({"first_name": "Raghavendra V", "last_name": "Siva", "list": listOfSts});
    newUser.save(function (err) {
        if (err) throw err;

        //console.log('User saved successfully!');
    });
});

app.post('/api/createUser', async function (req, res) {
    console.log("Create User Data is:", req.body);
    var reqDt = req.body || {};
    //if (reqDt.username && reqDt.password) {
    // User.find({ 'username': reqDt.username })
    //     .then(function (result) {
    //         if (null != result) {
    //             console.log("USERNAME ALREADY EXISTS:", result.username);
    //             res.send({ status: "FAIL", message: "User Already exists..." });
    //         }
    //         else {
    //             var hash = bcrypt.hashSync(reqDt.password, 8);
    //             var user = new User({ "name": reqDt.name, "username": reqDt.username, "password": hash, "isActive": true, "createdAt": moment().toDate() });
    //             user.save(function (err) {
    //                 if (err) throw err;
    //                 console.log("user saved successfully");
    //                 res.send({ status: "SUCCESS", message: "User Created..." });
    //             });
    //         }
    //     })
    /* var hash = bcrypt.hashSync(reqDt.password, 8);
     var user = new User({
         "name": reqDt.name,
         "username": reqDt.username,
         "password": hash,
         "isActive": true,
         "createdAt": moment().toDate()
     });
     user.save(function (err) {
         if (err) throw err;
         console.log("user saved successfully");
         res.send({status: "SUCCESS", message: "User Created..."});
     });*/

    //}
    // await createConnection();
});
app.post('/api/login', async function (req, res) {
        var reqDt = req.body || {};
        //console.log("Login Details:",reqDt);
        if (reqDt.username && reqDt.password) {
            User.find({'username': reqDt.username})
                .then(async function (result) {
                        //console.log("Result is:",result);
                        if (!result) {
                            // console.log("USER NOT FOUND:", result[0].username);
                            res.send({status: "FAIL", message: "Invalid Credentials"});
                        }
                        else {
                            // console.log("Passed pswd:",reqDt.password);
                            //console.log("User Passwd:",result[0].password);
                            var hash = bcrypt.compareSync(reqDt.password, result[0].password);
                            if (hash) {
                                isLoggedIn(result[0]._id, true);
                                deleteFromQueue(result[0]._id);
                                res.send({
                                    status: "SUCCESS",
                                    message: "Login successfully",
                                    userId: result[0]._id,
                                    "displayName": result[0].name
                                });
                            }
                            else {
                                res.send({status: "FAIL", message: "Invalid Credentials"});
                            }
                            //console.log("User Found?:",hash);

                        }
                    }
                );
            //console.log("User Login successfully")
        }
    }
);

app.post('/api/logout', async function (req, res) {
    isLoggedIn(req.body.userId, false);
    res.send({status: "SUCCESS", message: "Logout successfully"});
    deleteFromQueue(req.body.userId);

});

app.post('/api/save', async function (req, res) {
    var details = JSON.parse(req.body.regDetails);
    //console.log("Details:",details);

    var captchVerif = await verifyHumanity(details);
    //console.log("Captch Verification result:",captchVerif);

    if (captchVerif && captchVerif.success) {

        var isRegExists = await MlcRegistrationDetails.findOne({
            "emailId": details.emailId,
            "address_2": details.address_2
        });

        if (isRegExists && isRegExists._id) {
            res.send({"status": "FAIL", "message": "User already exists."});
        }
        else {

            var stsAudit = {"status": "QUEUE", "createdBy": "SELF", "createdAt": moment().toDate()};
            var kycDosArray = [{"preference": "PRIMARY", "docType": details.typeofKYCDoc}];

            var newRegDet = {
                firstName: details.firstName,
                lastName: details.lastName,
                emailId: details.emailId,
                gender: details.gender,
                countryId: details.countryId,
                cityId: details.cityId,
                citizenshipId: details.citizenshipId,
                contactNumber: details.contactNumber,
                address_1: details.address_1,
                address_2: details.address_2,
                termsAndConditions: {
                    "TC_1": details.TC_1,
                    "TC_2": details.TC_2,
                    "TC_3": details.TC_3,
                    "TC_4": details.TC_4,
                    "TC_5": details.TC_5
                },
                MLC_Id: "MLCO" + await getNextSequence("REGISTRATION"),
                statusAudit: stsAudit,
                // KYCDocsInfo : kycDosArray,
                ethValue: details.ethValue,
                dateOfBirth: details.dateOfBirth,
                sourceOfFunds: details.sourceOfFunds,
                createdAt: moment().toDate()
            };


            var newReq = new MlcRegistrationDetails(newRegDet);
            var regInsertResp = await newReq.save();

            if (regInsertResp && regInsertResp._id) {
                //console.log("New ID:",regInsertResp._id);
                // var docsInfo = [];
                //
                // let uploadFilesData = req.files;
                // if(uploadFilesData && uploadFilesData.file1){
                //     //console.log("File info:",uploadFilesData.file1);
                //     var updatedFileInfo = uploadFilesData.file1;
                //     var fileNameSplit = updatedFileInfo.name.split(".");
                //     //console.log("FileNameSplit:",fileNameSplit);
                //     var fileExtn = fileNameSplit[fileNameSplit.length-1];
                //     //console.log("File Extn:",fileExtn);
                //     updatedFileInfo.fileName=regInsertResp._id+"_"+details.typeofKYCDoc+"_1."+fileExtn;
                //     docsInfo.push({"docFileName":updatedFileInfo.fileName,"docType":details.typeofKYCDoc, "audit": {"createdAt": new Date(),"createdBy":"SELF"}});
                //     //console.log("FileInfo-1:",updatedFileInfo);
                //     await uploadFile(updatedFileInfo);
                // }
                //
                // if(uploadFilesData && uploadFilesData.file2){
                //     //console.log("File info:",uploadFilesData.file2);
                //     var updatedFileInfo = uploadFilesData.file2;
                //     var fileNameSplit = updatedFileInfo.name.split(".");
                //     //console.log("FileNameSplit:",fileNameSplit);
                //     var fileExtn = fileNameSplit[fileNameSplit.length-1];
                //     //console.log("File Extn:",fileExtn);
                //     updatedFileInfo.fileName=regInsertResp._id+"_"+details.typeofKYCDoc+"_2."+fileExtn;
                //     docsInfo.push({"docFileName":updatedFileInfo.fileName,"docType":details.typeofKYCDoc, "audit": {"createdAt": new Date(),"createdBy":"SELF"}});
                //     //console.log("FileInfo-2:",updatedFileInfo);
                //     await uploadFile(updatedFileInfo);
                // }

                // var updateResp = await MlcRegistrationDetails.findByIdAndUpdate({"_id":regInsertResp._id}
                // ,{"documentsList": docsInfo}
                // );
                MlcEmail.sendRegistrationEmail({
                    to: newRegDet.emailId,
                    firstName: newRegDet.firstName,
                    UniqueId: newRegDet.MLC_Id
                })
                //console.log("Update Resp:",updateResp);
            }
            //console.log("Response Sent.");
            res.send({status: "SUCCESS", "message": "Registration Success."});
        }
    }
    else {
        // Can check error codes in 'error-codes' of 'captchVerif'.
        res.send({status: "FAIL", "message": "Captcha verification failed. Try again."});
    }

});

async function uploadFile(fileInfo) {
    //console.log("File Info:",fileInfo);
    if (fileInfo) {
        var pathToFile = 'dist/public/upload/' + fileInfo.fileName;
        fileInfo.mv(pathToFile, function (err, res) {
            if (err) {
                console.log("File Upload Error is:", err);
            }
            else {
                //console.log("File Successfully Uploaded.");
            }
        });
    }
}

app.get('/api/statusesCounts', function (req, res) {
    MlcRegistrationDetails.aggregate([
        {$match: {'isActive': true}},
        {
            $group:
                {_id: '$status', count: {$sum: 1}}
        },

    ]).allowDiskUse(true)
        .exec(function (err, res2) {
            if (err) throw err;
            var resCtsObj = {};
            var totalCt = 0;
            for (var k = 0; k < res2.length; k++) {
                resCtsObj[res2[k]._id] = res2[k].count;
                totalCt = parseInt(totalCt) + parseInt(res2[k].count);
            }
            resCtsObj.TOTAL = totalCt;
            //console.log(resCtsObj);

            res.send({"countsData": resCtsObj, "status": "SUCCESS"});
        });
});

app.post('/api/getRecord', async function (req, res) {
    var userId = req.body.userId;
    //console.log("User Id:",userId);
    var exsIds = [];

    if (req.body.reqStatus != "BLACK" && req.body.reqStatus != "WHITE") {
        var existingTokens = await getQueueProcessor({});

        for (var i = 0; i < existingTokens.length; i++) {
            exsIds.push(existingTokens[i].regRecId);
        }
        //console.log("Existing Queue:", exsIds);
    }

    var regRec = await getRegistrationRecord({
        "_id": {$nin: exsIds},
        "status": req.body.reqStatus,
        "isActive": true
    }, {"createdAt": 1}, 1);

    if (regRec && regRec.length > 0) {
        regRec = regRec[0];
        //console.log("QUE Res:", regRec);
        if (req.body.reqStatus != "BLACK" && req.body.reqStatus != "WHITE") {

            await insertInQueueProcessor(userId, regRec._id);
        }
        var updatedDetails1 = await updateDetails(regRec);

        var respObj = {"regDetails": updatedDetails1, "status": "SUCCESS"};
        if (req.body.reqStatus === "WHITE") {

        }
        res.send(respObj);

    }
    else {
        res.send({"regDetails": {}, "status": "FAIL", "message": "No records found."});
    }
});

app.post("/api/getPreviousRecord", async function (req, res) {
    var data = req.body;
    //console.log("Data is:", data);
    var exsIds = [];

    if (data.status != "BLACK" && data.status != "WHITE") {
        var existingTokens = await getQueueProcessor({});

        for (var i = 0; i < existingTokens.length; i++) {
            exsIds.push(existingTokens[i].regRecId);
        }
        //console.log("Existing Queue:", exsIds);
    }

    var regRec = await getRegistrationRecord({"_id": data.regRecId});

    if (regRec && regRec.length > 0) {
        regRec = regRec[0];
        var regRec2 = await getRegistrationRecord({
            "_id": {$nin: exsIds},
            "status": data.status,
            "createdAt": {$lt: moment(regRec.createdAt).toDate()}
        }, {"createdAt": -1}, 1);
        if (regRec2 && regRec2[0] && regRec2[0]._id) {

            //if(!await checkIsExistInArray(data.status,["BLACK","WHITE"]))
            if (data.status != "BLACK" && data.status != "WHITE") {
                await deleteFromQueue(data.userId);
                await insertInQueueProcessor(data.userId, regRec2[0]._id);
            }
            var updatedDetails = await updateDetails(regRec2[0]);
            res.send({"regDetails": updatedDetails, "status": "SUCCESS"});
        }
        else {
            res.send({"regDetails": {}, "status": "FAIL", "message": "No Records."});
        }
    }
    else {
        res.send({"regDetails": {}, "status": "FAIL", "message": "No Records."});
    }


});

app.post("/api/getNextRecord", async function (req, res) {
    var data = req.body;
    // console.log("Data is:",data);
    var exsIds = [];

    if (data.status !== "BLACK" && data.status !== "WHITE") {
        var existingTokens = await getQueueProcessor({});


        for (var i = 0; i < existingTokens.length; i++) {
            exsIds.push(existingTokens[i].regRecId);
        }
        // console.log("Existing Queue:",exsIds);
    }

    var regRec = await getRegistrationRecord({"_id": data.regRecId});

    if (regRec && regRec.length > 0) {
        regRec = regRec[0];
        //console.log("Curr Rec TM is:",moment(moment(regRec.createdAt).toDate()).format("hh:mm:ss:SS A"));
        var regRec2 = await getRegistrationRecord({
            "_id": {$nin: exsIds},
            "status": data.status,
            "createdAt": {$gt: moment(regRec.createdAt).toDate()}
        }, {"createdAt": 1}, 1);

        if (regRec2 && regRec2[0] && regRec2[0]._id) {
            // console.log("RESULT is:",regRec2[0]);
            //if(!await  checkIsExistInArray(data.status,["BLACK","WHITE"])){
            if (data.status !== "BLACK" && data.status !== "WHITE") {
                await deleteFromQueue(data.userId);
                await insertInQueueProcessor(data.userId, regRec2[0]._id);
            }
            var updatedDetails = await updateDetails(regRec2[0]);
            res.send({"regDetails": updatedDetails, "status": "SUCCESS"});
        }

        else {
            res.send({"regDetails": {}, "status": "FAIL", "message": "No Records."});
        }

    }
    else {
        res.send({"regDetails": {}, "status": "FAIL", "message": "No Records."});
    }

});

async function updateDetails(updatedDetails) {
    var updatedObj = {};
    updatedDetails = updatedDetails.toObject();
    updatedObj = _.extend({}, updatedDetails);

    if (updatedDetails && updatedDetails.countryId === '') {
        // console.log("Data not available")
        updatedObj.countryName = 'NA'
    } else {
        var countryData = await MlcCountriesList.findOne({"_id": updatedObj.countryId});
        if (countryData) {
            //console.log("One Country Data:",countryData);
            updatedObj.countryName = countryData.displayName
        }
    }
    if (updatedDetails && updatedDetails.cityId === '') {
        // console.log("Data not available")
        updatedObj.cityName = 'NA'
    }
    else {
        var cityData = await MlcCitiesList.findOne({"_id": updatedObj.cityId});
        if (cityData) {
            //console.log("City Data",cityData )
            updatedObj.cityName = cityData.name
        }
    }
    if (updatedDetails && updatedDetails.citizenshipId === '') {
        // console.log("Data not available")
        updatedObj.citizenshipName = 'NA'
    }
    else {
        var citizenshipData = await MlcCountriesList.findOne({"_id": updatedObj.citizenshipId});
        if (citizenshipData) {
            //console.log("CitizenShip Data",citizenshipData)
            updatedObj.citizenshipName = citizenshipData.displayName
        }
    }

    //  console.log("DataSSSSS:",updatedObj);
    return updatedObj;
}

app.post("/api/updateStatus", async function (req, res) {
    var data = req.body;
    //console.log("Data is:", data);
    var actionSts = "FAIL";
    var resMessage = "-";
    if (data && data.userId && data.newStatus && data.regRecId) {
        var stsAudit = {"status": data.newStatus, "createdBy": data.userId, "createdAt": moment().toDate()};

        var regRec = await getRegistrationRecord({"_id": data.regRecId});
        regRec = regRec[0];
        var canUpdateStatus = false;

        if (data.newStatus === "WHITE" && regRec && regRec.status && (regRec.status === "QUEUE" || regRec.status === "HOLD" || regRec.status === "ADDL_INFO")) {
            canUpdateStatus = true;
            resMessage = "Moved to White list.";
        }
        else if (data.newStatus === "BLACK" && regRec && regRec.status && (regRec.status === "QUEUE" || regRec.status === "HOLD" || regRec.status === "ADDL_INFO")) {
            canUpdateStatus = true;
            resMessage = "Moved to Black list.";
        }
        else if (data.newStatus === "HOLD" && regRec && regRec.status && (regRec.status === "QUEUE" || regRec.status === "ADDL_INFO")) {
            canUpdateStatus = true;
            resMessage = "Moved to Hold list.";
        }
        else if (data.newStatus === "ADDL_INFO" && regRec && (regRec.status && regRec.status === "QUEUE" || regRec.status === "HOLD")) {
            canUpdateStatus = true;
            resMessage = "Additional Information.";
        }

        if (canUpdateStatus) {
            var resp = await updateRegistrationRecord({"_id": data.regRecId}, {
                "status": data.newStatus,
                $push: {"statusAudit": stsAudit}
            });

            if (resp) {
                actionSts = "SUCCESS";

            }
            //console.log("After Resp...");
        }
        else {
            resMessage = "Action not permitted.";
            //console.log("Not permitted...");
        }

        //console.log("Last line of Status Update...");
        if (actionSts === "SUCCESS") {
            await sendEmail(data.newStatus, data.regRecId)
        }
        res.send({"status": actionSts, "message": resMessage});

    }
});

const sendEmail = async function (status, regRecId) {
    var regRec = await getRegistrationRecord({"_id": regRecId});
    if (regRec && regRec[0]) {
        var reqObj = {
            firstName: regRec[0].firstName,
            uniqueId: regRec[0].MLC_Id,
            to: regRec[0].emailId
        }
        if (status === "WHITE") {
            MlcEmail.sendWhiteListEmail(reqObj);
            //console.log("WhiteList Data:", reqObj)
        }
        else if (status === "BLACK") {
            MlcEmail.sendBlackListEmail(reqObj)
        }
        else if (status === "HOLD") {
            MlcEmail.sendHoldEmail(reqObj)
        }
        else if (status === "ADDL_INFO") {
            reqObj = _.extend(reqObj, {"moreDetails": regRec[0].comments});

            MlcEmail.sendMoreInfoEmail(reqObj);
        }
    }

}

app.post('/api/saveAdditionalInfoData', async function (req, res) {
    var currSts = req.body;
    if (currSts && currSts.userId && currSts.regRecId) {
        var comment_1 = "";

        if (currSts.selectedDocsInfo && currSts.selectedDocsInfo.length > 0) {
            comment_1 = "Please send legible copies of the following:";
            var lineCounter = 1;

            var passportRec = _.findWhere(currSts.selectedDocsInfo, {"docType": "PASSPORT"});

            if (passportRec) {
                comment_1 = comment_1 + "<br>" + lineCounter + ". Passport.";
                lineCounter++;
            }

            var driLic = _.findWhere(currSts.selectedDocsInfo, {"docType": "DRV_LIC"});

            if (driLic) {
                comment_1 = comment_1 + "<br>" + lineCounter + ". Driving License.";
                lineCounter++;
            }

            var otherDoc = _.findWhere(currSts.selectedDocsInfo, {"docType": "OTHER"});

            if (otherDoc && otherDoc.otherMessage) {
                comment_1 = comment_1 + "<br>" + lineCounter + ". " + otherDoc.otherMessage;
            }
        }

        var commentsFinal = '';
        if (currSts.commentsEntered && currSts.commentsEntered != '') {
            if (comment_1 && comment_1 != '') {
                commentsFinal = comment_1 + "<br>";
            }
            commentsFinal = commentsFinal + currSts.commentsEntered;
        }
        var stsAudit = {"status": "ADDL_INFO", "createdBy": currSts.userId};

        var recUpdate = {"status": "ADDL_INFO", $push: {"statusAudit": stsAudit}};
        if (commentsFinal !== '') {
            commentsFinal = '<span>' + commentsFinal + '</span>';
            recUpdate = _.extend(recUpdate, {"comments": commentsFinal})
        }

        var updateRec = await MlcRegistrationDetails.findByIdAndUpdate({"_id": currSts.regRecId}, recUpdate);

        var actionSts = "FAIL";
        var stsMessage = "Unable to perform action.";
        if (updateRec) {
            actionSts = "SUCCESS";
            stsMessage = "Moved to Additional Info list."

            if (actionSts === "SUCCESS") {
                await sendEmail("ADDL_INFO", currSts.regRecId);
            }
        }

        res.send({"status": actionSts, "message": stsMessage});
    }

});


app.post('/api/saveAdditionalFile', async function (req, res) {
    var regDetails = JSON.parse(req.body.regDetails);
    // console.log("RegDetails:",regDetails)
    var fileInfo = req.files.file1;

    var actionSts = "FAIL";
    var stsMessage = "Upload failed.";

    var regRec = await getRegistrationRecord({"_id": regDetails.regRecId});

    if (regRec && regRec[0] && regRec[0]._id) {
        regRec = regRec[0];

        var fileName = fileInfo.name.replace(/ /g, "_");
        fileName = regRec._id + "_" + fileName;
        fileInfo.fileName = fileName;
        //console.log("Additional File info:",fileInfo);
        var newFileObj = {"docFileName": fileName, "docType": "DEFAULT"};
        var docsList = regRec.documentsList || [];
        docsList.push(newFileObj);
        //console.log("Data of Uploads:",docsList);
        await uploadFile(fileInfo);
        var updatedRec = '';

        var regRecUpdate = await MlcRegistrationDetails.findByIdAndUpdate({"_id": regDetails.regRecId}, {"documentsList": docsList});

        if (regRecUpdate) {
            //console.log("Additional info Upload done.");
            actionSts = "SUCCESS";
            stsMessage = "Upload finished."
            updatedRec = await getRegistrationRecord({"_id": regDetails.regRecId});
            // console.log("Updated Record:",updatedRec[0]);
            updatedRec = await updateDetails(updatedRec[0]);
        }
    }
    res.send({"status": actionSts, "message": stsMessage, "regDetails": updatedRec});

});

app.post('/api/getUserDetails', async function (req, res) {
    var reqData = req.body;

    if (reqData && reqData.userId) {
        var userDt = await User.findById({"_id": reqData.userId});


    }
    res.send({});
});

app.post('/api/updateQueueProcessor', function (req, res) {
    var reqDt = req.body;

    if (reqDt && reqDt.regRecId && reqDt.userId) {
        deleteFromQueue(reqDt.userId);
    }
    res.send({"status": "NA"});
});


const insertInQueueProcessor = async function (userId, regRecId) {
    //console.log("Iam in QU Prc:",userId, regRecId);
    if (userId && regRecId) {
        var prId = await getQueueProcessor({"regRecId": regRecId});
        //console.log("Existing Qu res:",prId);
        if (prId && prId.length === 1) {

        }
        else {
            var newPrcObj = new MlcQueueProcessor({
                "regRecId": regRecId,
                "userId": userId,
                "createdAt": moment().toDate()
            });
            newPrcObj.save(function (err, resp) {
                if (err) console.log(err)
                else {
                    //console.log("Queue added...");
                }
            });

        }
    }
};

function isLoggedIn(userId, status) {
    User.findByIdAndUpdate({"_id": userId}, {isLoggedIn: status}, function (err, user) {
        if (err) throw err;
        else {
            //console.log("Status updated...");
        }

    })
}

async function getQueueProcessor(query) {
    var qpr = await MlcQueueProcessor.find(query);

    return qpr;
};

async function getRegistrationRecord(regQuery, sortQuery, limitValue) {
    sortQuery = sortQuery || {};
    var reqRes = [];
    if (limitValue && limitValue > 0) {
        reqRes = await MlcRegistrationDetails.find(regQuery).sort(sortQuery).limit(limitValue);
    }
    else {
        reqRes = await MlcRegistrationDetails.find(regQuery).sort(sortQuery);
    }

    return reqRes;
};

async function updateRegistrationRecord(matchQuery, updateQuery) {
    var updateRes = false;

    if (matchQuery && updateQuery) {
        var res = await MlcRegistrationDetails.findByIdAndUpdate(matchQuery, updateQuery);

        if (res) {
            updateRes = true;
            //console.log("Reg.Status updated...");
        }
    }
    //console.log("last line of Update:",updateRes);
    return updateRes;
}

async function deleteFromQueue(userId) {
    var delSts = await  MlcQueueProcessor.deleteMany({"userId": userId});
    //console.log("Del is:",delSts);
    return true;
};

async function checkIsExistInArray(checkWith, checkInArray) {
    var checkRes = false;
    if (checkWith && checkInArray && checkInArray.length > 0) {
        var recIndex = checkInArray.findIndex(async function (chkRec) {
            if (chkRec == checkWith) {
                return chkRec;
            }
        });

        if (recIndex != -1) {
            checkRes = true;
        }
    }
    return checkRes;
};

app.post('/api/saveEmailTemplate', async function (req, res) {
    var emailDetails = req.body;
    return res.send(await saveEmailTemplateDetails(emailDetails));

});

app.post('/api/saveAndSendEmailTemplate',async function(req,res){
    var emailTemplateDts = req.body;
    var email = await saveEmailTemplateDetails(emailTemplateDts)
    console.log("Response is:",email);
    return  res.send(email);
    // if(email && email.status && email.status === "SUCCESS"){
    //
    // }

});


var saveEmailTemplateDetails = async function(emailDetails){
    var res = {};

    if (emailDetails && emailDetails.tempId) {
        var obj = await MlcEmailTemplates.findOne({"_id": emailDetails.tempId});
        obj = obj.toObject();
        //console.log("Old Data:####", obj)

        var adtObjs = obj.audit || {};
        adtObjs.updatedAt = moment().toDate();
        adtObjs.updatedBy = emailDetails.userId;

        obj.templateName = emailDetails.templateName;
        obj.fromID = emailDetails.fromID;
        obj.subject = emailDetails.subject;
        obj.bodyContent = emailDetails.bodyContent;
        obj.audit = adtObjs;

        var updateDetails = await MlcEmailTemplates.findByIdAndUpdate({"_id": obj._id}, obj);
        res = ({"status" : "SUCCESS", "message" : "Template updated successfully"})
    }
    else {
        var adtObj = {"createdAt": moment().toDate(), "createdBy": emailDetails.userId};
        var newEmailDt = {
            templateName: emailDetails.templateName,
            fromID: emailDetails.fromID,
            subject: emailDetails.subject,
            bodyContent: emailDetails.bodyContent,
            isActive: true,
            audit: adtObj,
            templateFor: "WHITELIST_1"
        };
        var newEmailDts = new MlcEmailTemplates(newEmailDt);
        var savedDetails =  await newEmailDts.save();
        console.log("Response:",savedDetails)
        if(savedDetails){
            res = ({"status": "SUCCESS", "message": "Template saved successfully"})
        }
        else{
            res = ({"status" : "FAIL" , "message":"Something went wrong!!!"})
        }
    }
    return res;

}


app.get('/api/getEmailTemplatesList', async function (req, res) {
    var templateDetails = await MlcEmailTemplates.find({isActive: true}, {templateName: 1});
    //console.log("EMAILTEMPLATES:",templateDetails)
    res.send({"templateData": templateDetails})
});

app.post('/api/getEmailTemplateData', async function (req, res) {
    var templateDetails = req.body
    console.log("Temp:::", templateDetails)
    var templateData = await MlcEmailTemplates.findOne({"_id": templateDetails.tempId})
    console.log("Template Details :", templateData)
    res.send({"tempData": templateData})
})


app.get('/api/getETHDetails',async function(req,res){
    var ethTransferDetails = await MlcTransactions.find({})
    console.log("ETH Details:",ethTransferDetails);
    res.send({"ethDetails": ethTransferDetails })

});

app.get('/api/countriesList', async function (req, res) {
    var country = await MlcCountriesList.find({isActive: true}).sort({displayName: 1});
    //console.log("Length", country.length)
    res.send({"countriesList": country})
});


app.post('/api/citiesList', async function (req, res) {
    var countryId = req.body.countryId
    //console.log("data of countries:", countryId)
    if (countryId) {
        var cities = await MlcCitiesList.find({"countryId": countryId, isActive: true}).sort({name: 1});
        //console.log("Length of cities", cities.length);
        res.send({"citiesList": cities})
    }
});

app.get('/api/citizenshipList', async function (req, res) {
    var citizenship = await MlcCitizenshipList.find({isActive: true}).sort({citizenshipTypeDisplayName: 1});
    //console.log("Length CS:", citizenship.length);
    res.send({"citizenshipList": citizenship})
});

app.get('/api/MlcCountriesList', async function (req, res) {
    let countries = await MlcCountries.find({});
    console.log("List count is:", countries.length);
    for (var count = 0; count < countries.length; count++) {
        //console.log("Countries List", countries[count]);
        var oldRec = countries[count];
        var newCtObj = {
            "countryCode": oldRec.countryCode,
            "country": oldRec.country,
            "displayName": oldRec.displayName,
            "url": oldRec.url,
            "isActive": oldRec.isActive,
            "lat": oldRec.lat,
            "lng": oldRec.lng,
            "capital": oldRec.capital,
            "about": oldRec.about,
            "phoneNumberCode": oldRec.phoneNumberCode,
            "flag_32": oldRec.flag_32,
            "flag_128": oldRec.flag_128
        };
        // _.extend({},countries[count]);
        //console.log("New Country:", newCtObj);
        delete newCtObj._id;
        var newcountry = new MlcCountriesList(newCtObj);
        //    var newCt = await newcountry.save();
        //    if(newCt){
        //     console.log("New Country:",newCt);
        // }
        newcountry.save(function (err) {
            if (err) console.log(err);
        });
    }
    res.send();

})
app.get('/api/MlcCitiesList', async function (req, res) {
    let cities = await MlcCities.find({})
    console.log("Length of cities:", cities.length);
    for (var ccount = 0; ccount < cities.length; ccount++) {
        //console.log("Cities List:", cities[ccount]);
        var prevRec = cities[ccount];
        var newObj = {
            "name": prevRec.name,
            "stateId": prevRec.stateId,
            "countryId": prevRec.countryId,
            "countryCode": prevRec.countryCode,
            "isActive": prevRec.isActive,
            "lat": prevRec.lat,
            "lng": prevRec.lng
        };
        //console.log("New Cities:", newObj);
        delete newObj._id;
        var newcities = new MlcCitiesList(newObj);
        newcities.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
        res.send();
    }
})
app.get('/api/MlcCitieList', async function (req, res) {
    let countryLists = await MlcCountriesList.find({countryCode: {$exists: true}});
    console.log("CountriesId update in CitiesList : Length:", countryLists.length);
    for (var g = 0; g < countryLists.length; g++) {
        let citiesUpdate = await MlcCitiesList.update({"countryCode": countryLists[g].countryCode}, {"countryId": countryLists[g]._id}, {multi: true}).exec();
        if (citiesUpdate) {
            //console.log("citiesUpdate:", citiesUpdate)
        }
    }
    console.log("Update Completed.");
    res.send({});

});

app.get('/api/MlcCitizenshipList', async function (req, res) {
    let citizenship = await MlcCitizenship.find({})
    console.log("List of citizens:", citizenship.length);
    for (var cs = 0; cs < citizenship.length; cs++) {
        //console.log("citizens List:", citizenship[cs]);
        var lastRec = citizenship[cs];
        var newObjs = {
            "citizenshipTypeName": lastRec.citizenshipTypeName,
            "citizenshipTypeDisplayName": lastRec.citizenshipTypeDisplayName,
            "about": lastRec.about,
            "isActive": lastRec.isActive,
            "createdBy": lastRec.createdBy,
            "createdDate": lastRec.createdDate
        };
        //console.log("New Citizenship:", newObjs);
        delete newObjs._id;
        var newcitizens = new MlcCitizenshipList(newObjs);
        newcitizens.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    console.log("Citizenship list migration completed.");
    res.send({});
})
app.post('/api/upload', (req, res, next) => {
    console.log(req.body);
    let imageFile = req.files;
    console.log("Files are:", imageFile);
    // for(var k=0;k<imageFile.length;k++){
    //     var currFile = imageFile[k];
    //     var pathIs = './public/upload/ABC'+currFile.name;
    //     currFile.mv(pathIs, function(err) {
    //         if (err) {
    //             console.log("Error is:",err);
    //         }
    //     });
    // }


});

async function getNextSequence(seqFor) {
    var seqIs = '';
    var currSeq = await MlcSequences.find({"sequenceFor": seqFor});

    if (currSeq && currSeq[0] && currSeq[0]._id) {
        currSeq = currSeq[0];
        var nextSeIs = parseInt(currSeq.sequenceNumber) + 1;
        seqIs = nextSeIs;
        var seqUpdRes = await MlcSequences.findByIdAndUpdate({"_id": currSeq._id}, {"sequenceNumber": nextSeIs});

        if (seqUpdRes && seqUpdRes._id) {
            //console.log("Next Sequence updated.");
        }
    }

    return seqIs;
};

app.get('/api/MlcCitiesListWithCountryId', async function (req, res) {
    let cities = await MlcCities.find({})
    console.log("Length of cities:", cities.length);
    for (var ccount = 0; ccount < cities.length; ccount++) {
        //console.log("Cities List:", cities[ccount]);
        var prevRec = cities[ccount];
        var newObj = {
            "name": prevRec.name,
            "stateId": prevRec.stateId,
            "countryId": prevRec.countryId,
            "countryCode": prevRec.countryCode,
            "isActive": prevRec.isActive,
            "lat": prevRec.lat,
            "lng": prevRec.lng
        };
        //console.log("New Cities:", newObj);
        delete newObj._id;
        var newcities = new MlcCitiesList(newObj);
        newcities.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
        res.send();
    }
})

app.post('/api/saveWhitelistFormDetails', async function (req, res) {
    var wtdetails = req.body
    //console.log("Details of white list form:",wtdetails);

    // var validateDetails = await MlcRegistrationDetails.findOne({
    //     //"MLC_Id": wtdetails.uniqueId,
    //     "address_2": wtdetails.address
    // });
    // if (validateDetails && validateDetails._id) {
    //     validateDetails = validateDetails.toObject();
    //     //console.log("######DETAILS:",validateDetails)
    //
    //     if (validateDetails && validateDetails.MLC_Id && validateDetails.address_2) {
    var whitelistDetails = {
        emailId: wtdetails.emailId,
        //regRecId: validateDetails._id,
        ethTransfered: wtdetails.ethTransfered,
        dateOfTransfer: moment(moment(wtdetails.dateOfTransfer).toDate()).endOf("day").toDate(),
        txHash: wtdetails.txHash,
        termsAndConditions: {"TC_1": wtdetails.TC_1, "TC_2": wtdetails.TC_2},
        createdAt: moment().toDate()
    };

    var wtReg = new MlcTransactions(whitelistDetails);
    var wtregDetails = await wtReg.save();
    MlcEmail.sendTransferThankYouEmail({
        to: wtdetails.emailId,
        firstName: ''  //validateDetails.firstName,
        //UniqueId: validateDetails.uniqueId
    });

    if (wtregDetails) {
        res.send({"status": "SUCCESS", "message": "ETH Details updated"});
    }

    //}

    // }
    // else {
    //     res.send({"status": "FAIL", "message": "Registration UniqueId & Wallet Public address do not match"});
    // }

});

app.post('/api/saveNewCity', async function (req, res) {
    var cityDetails = req.body;
    var isCityExists = await MlcCitiesList.findOne({ "name": cityDetails.cityName, "countryId": cityDetails.countryId })
    if (isCityExists && isCityExists._id) {
        res.send({ "status": "FAIL", "message": "City already exists" });
    }
    else {
        var countriesList = await MlcCountriesList.findOne({ "_id": cityDetails.countryId });
        var newCityDet = {
            name: cityDetails.cityName,
            countryId: cityDetails.countryId,
            countryCode: countriesList.countryCode,
            isActive: true
        };
        var addCity = new MlcCitiesList(newCityDet);
        addCity.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
        res.send({ "status": "SUCCESS", "message": "New City added Successfully" })
    }

})
app.post('/api/saveNewCountry', async function (req, res) {
    var countryDetails = req.body;
    var isCountryExists = await MlcCountriesList.findOne({ "country": countryDetails.countryName })
    if (isCountryExists && isCountryExists._id) {
        res.send({ "status": "FAIL", "message": "Country already exists" });
    }
    else {
        var newCountryDet = {
            country: countryDetails.countryName,
            displayName: countryDetails.countryName,
            countryCode: countryDetails.countryCode,
            phoneNumberCode: countryDetails.phoneNumberCode,
            isActive: true
        };
        var addCountry = new MlcCountriesList(newCountryDet);
        addCountry.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
        res.send({ "status": "SUCCESS", "message": "New Country added Successfully" });
    }
})

async function verifyHumanity(req) {
    // Q is a nice little promise library I'm using in my project
    const d = Q.defer();
    const recaptchaResponse = req.selectedCaptch;

    request.post('https://www.google.com/recaptcha/api/siteverify', {
        form: {
            secret: "6LfU718UAAAAAJiqDh1t23laSpMrg7VJXeLvyvDf",
            response: recaptchaResponse
        }
    }, (err, httpResponse, body) => {
        if (err) {
            d.reject(new Error(err));
        } else {
            const result = JSON.parse(body);
            //console.log("Response is:",result);
            if (result.success) {
                d.resolve(result);
            } else {
                d.resolve(result);
                //d.reject(new Error());
            }
        }
    });

    return d.promise;
};

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

}


// MlcSchedulers.dailyReport();