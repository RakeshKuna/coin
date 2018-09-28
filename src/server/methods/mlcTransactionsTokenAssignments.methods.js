const DBConnection = require('../mlcDbConfig');
var moment = require('moment');
var randomId = require('random-id');
var Promise = require("bluebird");
const _ = require('underscore');

const MlcTransfers = require('./mlcTransfers.methods');


async function setTokensData(dataList){
    //console.log("Iam in Insert..");
    return Promise.all([await saveData(dataList)]).then(function(resp){
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
                } // end of for loop...
            } // end of if...
            resolve({"totalRows": rowsCount});
    });

}

async function getTransHashStatus(reqParams){
    console.log("In side getTransHashStatus..");
    var getQuery = "select * from mlc_transactions_token_assignments where status='NO' and txhash != '' ";
    const dbConn = await DBConnection.getConnection();
    var resultData = await dbConn.query(getQuery);

    if(resultData && resultData.rows && resultData.rows.length>0){

        for( var i = 0; i<resultData.rows.length; i++) {
            var rowRec = resultData.rows[i];
            console.log("Getting Transaction Hash status  for:", rowRec.txhash);

            var txStatus =   await MlcTransfers.doStatus(rowRec.txhash);

            //console.log("Transaction Hash Status :", txStatus.txObj.status.toString().toUpperCase());

            var success = null;
            if(txStatus.txObj.status.toString() === 'true')
                success = "SUCCESS";
            else
                success = "FAIL";

            var updateData = 'UPDATE "mlc_transactions_token_assignments" SET ' +
                '"status" = ' +
                "'"+success +
                "'" +
                "  WHERE " +
                '"id" =' +
                " '"+rowRec.id+"'";
            console.log("Update details are :", updateData );

         var updateresult = await dbConn.query(updateData);

        }// end of for loop...
        console.log("Completed the TransHas status...");
    } //end of if ...
}


async function startAssignment(reqParams){
        console.log("Iam in Assignment..");
        var getQuery = "select * from mlc_transactions_token_assignments where status='NO' ";
        const dbConn = await DBConnection.getConnection();
        var resultData = await dbConn.query(getQuery);

        if(resultData && resultData.rows && resultData.rows.length>0){

           // _.each(resultData.rows,async function(rowRec, rowIndex){
            for( var i = 0; i<resultData.rows.length; i++) {
                var rowRec = resultData.rows[i];
                console.log("calling for:", rowRec.receiver_address);


                var val = rowRec.tokens_count * 1000000000000000000;
                //var txHashNow = await MlcTransfers.doTransaction(rowRec.receiver_address, rowRec.tokens_count.toString());
                var txHashNow = await MlcTransfers.doTransaction(rowRec.receiver_address, val.toString());

                let parse = JSON.stringify(txHashNow);
                let parse1 = JSON.parse(parse);
                let parseTxHash = parse1.TxHash;

                var updateData = 'UPDATE "mlc_transactions_token_assignments" SET ' +
                    //'"status" = ' +
                    //"'"+YES+
                    //"'," +
                    '"txhash" ='+
                    "'"+
                    parseTxHash +
                    "',"+
                    '"updated_at" ='+
                    "'"+moment(moment().toDate()).format("x")+ "'" +
                    "  WHERE " +
                    '"receiver_address" =' +
                    " '"+rowRec.receiver_address+"'";

                var updateresult = await dbConn.query(updateData);

                //need to write update query to database  same table
            }
                //});
            console.log("END...");
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
        }// end of if...

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

module.exports = {setTokensData,startAssignment,getTransferDetails, getTotalNumberOfRecords, getTransHashStatus};