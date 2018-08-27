const DBConnection = require('../mlcDbConfig');


async function getTotalRecordCount(statusValue){
    var resultData = {}
    var whiteListDetails = 'SELECT COUNT(*) AS STATUSCOUNT FROM user_status WHERE kyc_status = '+statusValue;
    const client = await DBConnection.getConnection();
    var response = await client.query(whiteListDetails);

    if(!response){
        resultData = {"status" : "FAIL", "message": resultData};
    }
    else {
        resultData = {"status":"SUCCESS","statusCount" : response.rows[0].statuscount};
    }

    client.end();
    return resultData;

}

 async function getRegistrationRecordDetails(regData){
     var res = {};

     var userDetails = 'SELECT t1.first_name,t1.last_name,t1.id,t1.created_at,t2.address,t2.wallet_address,t1.email,t2.date_of_birth,t2.source_of_funds,t3.comment from users t1 inner join user_details t2 on t1.id=t2.user_id inner join user_status t3 on t2.user_id=t3.user_id and t3.kyc_status='+regData.recordStatus;

     if(regData.recordType){
           if(regData.recordType === "FIRST"){

           } 
           else if(regData.recordType === "PREV"){
                userDetails+=" and t1.created_at < '"+regData.currRecCreatedAt+"'";
           }
           else if(regData.recordType === "NEXT"){
                userDetails+=" and t1.created_at > '"+regData.currRecCreatedAt+"'";
           }
     }
     
     userDetails+=' order by t1.created_at';

     if(regData.recordType){
        if(regData.recordType === "FIRST"){

        } 
        else if(regData.recordType === "PREV"){
            userDetails+=' DESC';
        }
        else if(regData.recordType === "NEXT"){
            
        }
    }

    userDetails+=" limit '"+regData.limit+"'";
    //console.log("Query is:",userDetails);

     const client =await DBConnection.getConnection();
     var resp = await client.query(userDetails);
     //console.log("Rows are:",resp.rows);

     if(!resp){
        res = {"status" : "FAIL", "regDetails": resp,"message":"Please try again"};
     }
    else if(resp.rows.length === 0) {
        res = {"status" : "FAIL","message":"No records"};
    }
     else {
        res = {"status":"SUCCESS","regDetails": resp.rows[0]};
    }
    client.end();
    return res;

 }

 async function getTotalAmountPerStatus(statusValue){
     var resultData = {};
     var totalAmount = 'select SUM(t1."amount") as sumvalue, t1.currency_type from "mlcTransactions" t2 inner join  user_details t1 on t1.wallet_address = t2."publicAddress" inner join user_status t3 '
         + 'on t3.user_id=t1.user_id and t3.kyc_status='+statusValue +
         'group by t1.currency_type';

     const client = await DBConnection.getConnection();
     var response = await client.query(totalAmount);
     if(!response){
         resultData = {"status" : "FAIL", "message": resultData};
     }
     else {
         resultData = {"status":"SUCCESS","amountTotalsObj" : response.rows};
     }
     client.end();
     return resultData;
 }

module.exports = { getTotalRecordCount,getRegistrationRecordDetails,getTotalAmountPerStatus }