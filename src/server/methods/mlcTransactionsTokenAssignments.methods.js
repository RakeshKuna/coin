const DBConnection = require('../mlcDbConfig');
var moment = require('moment');
var randomId = require('random-id');
var Promise = require("bluebird");
const _ = require('underscore');


async function setTokensData(dataList){
    //console.log("Iam in Insert..");
    return Promise.all(
        [await saveData(dataList)]
    ).then(function(resp){
        //console.log("End..");
        return Promise.resolve(resp);
    }, function(error) {

        console.log('Error encountered', error);
        return Promise.reject(error);

    });

}


async function saveData(dataList){
    //console.log("Iam in SaveData..");
    var rowsCount = 0;
    return new Promise(async function(resolve, reject) {
        if(dataList && dataList.length>0){

            const dbConn = await DBConnection.getConnection();
            for(var i =0; i<dataList.length;i++){
                var dataRec = dataList[i];

                var uniqueId = randomId(20);
                var createdAt = moment(moment().toDate()).format("x");

                var dataQuery = 'insert into mlc_transactions_token_assignments("id","receiver_address","tokens_count","status","created_at") values(' +
                    "'" + uniqueId + "', '" + dataRec.receiverAddress + "' , '" + dataRec.tokens + "' , 'NO', '" + createdAt + "'" +
                    ') ';

                var result = await dbConn.query(dataQuery);
                //console.log("Resp:", result);
                if (result && result.rowCount === 1) {
                    rowsCount++;
                    //console.log("Added:", dataRec.receiverAddress);
                }
                else {
                    //console.log("Insert failed for:", dataRec.receiverAddress);
                }
            }
        }
        resolve({"totalRows": rowsCount});
    });

}

async function startAssignment(reqParams){
    console.log("Iam in Assignment..");
    var getQuery = "select * from mlc_transactions_token_assignments where status='NO' ";
    const dbConn = await DBConnection.getConnection();
    var resultData = await dbConn.query(getQuery);

    if(resultData && resultData.rows && resultData.rows.length>0){

    }

}

async function getTransferDetails(reqParams){
    var resp = {};

    if(reqParams && reqParams.rowsPerPage>=0){
        var getDataQuery = "select * from mlc_transactions_token_assignments order by created_at DESC OFFSET "+reqParams.offset+" LIMIT "+reqParams.rowsPerPage;

        const dbConn = await DBConnection.getConnection();

        var resultData = await dbConn.query(getDataQuery);

        if(!resultData){
            resp = {"status" : "FAIL", "message": "Please try again."};
        }
        else if(resultData && resultData.rows && resultData.rows.length === 0){
            resp = {"status" : "INFO", "message": "No records."};
        }
        else if(resultData && resultData.rows && resultData.rows.length>0){
            resp = {"status":"SUCCESS","trDetails": resultData.rows};
        }

    }


    return resp;
}

async function getTotalNumberOfRecords(){
    var resp = {"rowsCount": 0};
    var getDataCountQuery = "select count(*) totalrows from mlc_transactions_token_assignments";
    const dbConn = await DBConnection.getConnection();

    var resultData = await dbConn.query(getDataCountQuery);

    if(resultData && resultData.rows && resultData.rows[0] && resultData.rows[0].totalrows){
        resp.rowsCount = resultData.rows[0].totalrows;
    }

    return resp;
}

module.exports = {setTokensData,startAssignment,getTransferDetails, getTotalNumberOfRecords};