const DBConnection = require('../mlcDbConfig');
var randomId = require('random-id');
var moment = require('moment');
const _ = require('underscore');

async function saveTransactionDetails(wtDetails){
    var resp = {};
    var Id = randomId(15);
    var details = 'INSERT INTO "mlcTransactions" ("id", "emailId", "submittedValue", "txHash", "publicAddress", "dateOfTransfer", "export","createdAt") VALUES' +
    " ('"+Id+"', '"+wtDetails.emailId+"','"+wtDetails.submittedValue+"', '"+wtDetails.txHash+"' ,'"+wtDetails.address+"','"+wtDetails.dateOfTransfer+"','NA' ,'"+moment().toDate()+"')";
    const client = await DBConnection.getConnection();
   var res =   await client.query(details);
    if(!res){
        resp = {"status": "FAIL", "message": "Please try again"}
    }
    else if(res && res.rowCount && res.rowCount == 1){
        resp = {"status": "SUCCESS", "message": "ETH Details saved successfully"};
    }
    client.end()
  return resp;
}


async function getTransactionDetails(details){
    var res ={}
    var transactionDetails = 'select t1.first_name,t1.last_name, t2.user_id, t2.currency_type, t3."id", t3."publicAddress",t3."submittedValue",t3."txHash",t3."dateOfTransfer",t3."actualValue",t3."export" from users t1 inner join user_details t2 on t1.id = t2.user_id right outer join "mlcTransactions" t3 on t2.wallet_address = t3."publicAddress" order by "createdAt" OFFSET '+details.offset+' LIMIT '+details.rowsPerPage+''
    const client = await DBConnection.getConnection();
    var response = await client.query(transactionDetails);

        if(!response){
        res = {"status" : "FAIL", "message": res}
    }
    else {
        res = {"status" : "SUCCESS", "message": "ETH Details", "ethDetails" : response.rows };
    }
    client.end()
    return res;
}



async function updateTransactionDetails(transactionDetails){
    // console.log("Transaction Details:",transactionDetails);
 var result ={}
 if(transactionDetails && transactionDetails.id){
     var updateTransactionDetails = 'UPDATE "mlcTransactions" SET ' +
         '"actualValue" = ' +
         "'"+transactionDetails.actualValue+
         "'," +
         '"confirmedAt" ='+
         "'"+moment(moment().toDate()).format("x")+
         "',"+
         ' "export"=' +
         " 'NO' WHERE " +
         '"id" =' +
         " '"+transactionDetails.id+"'";

     // console.log("Query is:",updateTransactionDetails);

     const client = await DBConnection.getConnection();
     var resp = await client.query(updateTransactionDetails);
     if(!resp){
         result = {"status" : "FAIL", "message": "Please try again"}
     }

     else if (resp && resp.rowCount && resp.rowCount == 1){
         var updatedDetails = 'SELECT * from "mlcTransactions" WHERE' +
             ' "id" = '+
             "'"+transactionDetails.id+"'"

         var query = await client.query(updatedDetails)

         result = {"status" : "SUCCESS", "message": "Transaction details updated successfully", "updatedTransactionDetails" : query.rows[0]};
     }
     client.end()
     return result;
 }

}

async function getTotalNumberOfRecords(){
    var result ={}
    var transactionDetails  = 'SELECT COUNT(*) AS ROWCOUNT FROM "mlcTransactions"'
    const client = await DBConnection.getConnection();
    var response = await client.query(transactionDetails);

    if(!response){
        result = {"status" : "FAIL", "message": result,"rowsCount":0};
    }
    else {
        result = {"rowsCount" : response.rows[0].rowcount};
    }
    client.end();
    return result;

}


async function getPendingListCount(){
    var responseData = {}
    var pendingListDetails = 'SELECT COUNT(*) AS PENDINGLISTCOUNT FROM "mlcTransactions"' +
        ' WHERE' +
        ' "export" =' +
        "'NA'"
    const client = await DBConnection.getConnection();
    var resp = await client.query(pendingListDetails);

    if(!resp){
        responseData = {"status" : "FAIL", "message": responseData};
        console.log("ERROR DATA:",responseData);
    }
    else {
        responseData = {"pendingListCount" : resp.rows[0].pendinglistcount};
    }
    client.end();
    return responseData;
}


async function getSumOfSubmittedValues(){
    var result = {}
    var submittedValue = 'select SUM(t2."submittedValue") as sumvalue, t1.currency_type from "mlcTransactions" t2 inner join  user_details t1 on t1.wallet_address = t2."publicAddress" group by t1.currency_type'
    const client = await DBConnection.getConnection();
    var response = await client.query(submittedValue);
    if(!response){
        result = {"status" : "FAIL", "message": result}
    }
    else{
        result = {"submittedValue" : response.rows};
    }
    client.end();
    return result;
}

async function getTransactionDetailsToBeExported(){
    var data = {};
    var Total = 'select t1.first_name,t1.last_name, t2.user_id, t2.currency_type, t3."id", t3."publicAddress",t3."submittedValue",t3."txHash",t3."dateOfTransfer",t3."actualValue",t3.export,t3."confirmedAt" from users t1 inner join user_details t2 on t1.id = t2.user_id inner join "mlcTransactions" t3 on (t2.wallet_address = t3."publicAddress" and  t3."export" =' +" 'NO') "+'order by "createdAt" ';

    const client= await DBConnection.getConnection();
    var response = await client.query(Total);
    //console.log("Query Resp:",response);

    if(!response){
        data = {"status" : "FAIL", "message": 'Please try again'};
    }
    else if(response && response.rows && response.rows.length === 0){
        data = {"status" : "FAIL", "message": 'No records to export.'};
    }
    else{
        var allData = [];

                    // If any change in the order if data, then change heading order as well as columns data in below code.

                    // Column headings.
        allData = [["Name","Unique ID","Public Address","Value/Currency Type","Tx.Hash","Actual Value","Date of Transfer","confirmedAt"]];

                    // Columns data.
        _.each(response.rows,async function(rowRec){
            var dateInFormat = moment(moment(rowRec.dateOfTransfer).toDate()).format("DD-MMM-YYYY");
            var confirmDate = moment(moment(rowRec.confirmedAt,'x').toDate()).format("DD-MMM-YYYY");

            allData.push(['"'+ rowRec.first_name+'"','"'+ rowRec.user_id+'", "'+ rowRec.publicAddress+'", "'+ rowRec.submittedValue+'/'+rowRec.currency_type+'", "'+ rowRec.txHash+'", "'+ rowRec.actualValue+'", "'+ dateInFormat+'","'+confirmDate+'"']);

        });


        if(response.rows.length == (allData.length-1)){
            var updateSts = 'update "mlcTransactions" SET export='+" 'YES' where export='NO' ";

            var updResponse = await client.query(updateSts);
            //console.log("Update Resp:",updResponse);

                    // Update 'export' status then only send response to client.
            if(updResponse && updResponse.rowCount>0){
                data = {"status" : "SUCCESS", "message":"Total transaction details","exportData":allData};
            }
        }

    }

    client.end();
    return data;
}

module.exports = { saveTransactionDetails, getTransactionDetails, updateTransactionDetails, getTotalNumberOfRecords, getPendingListCount, getSumOfSubmittedValues,getTransactionDetailsToBeExported}