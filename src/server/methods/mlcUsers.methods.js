const DBConnection = require('../mlcDbConfig');
var randomId = require('random-id');
var moment = require('moment');
const _ = require('underscore');
var bcrypt = require('bcrypt');

async function createUser(userDetails) {
    var resp = {};
    var Id = randomId(15);
    var pass = bcrypt.hashSync(userDetails.password, 8);
    var details = 'INSERT INTO "mlcUsers" ("username", "password", "name", "isActive","id") VALUES' +
        " ('" + userDetails.username + "','" + pass + "', '" + userDetails.name + "' ,'" + true + "','" + Id + "')";
    const client = await DBConnection.getConnection();
    var res = await client.query(details);
    if (!res) {
        resp = { "status": "FAIL", "message": resp }
    }
    else if (res && res.rowCount && res.rowCount == 1) {
        resp = { "status": "SUCCESS", "message": "User created successfully" };
    }
    client.end()
    return resp;
}

async function userLogin(det) {
    // console.log("Req are:",det);
    var resp = {};
    var user = 'SELECT password,name,id FROM "mlcUsers" WHERE username =' +
        "'" + det.username + "'" +
        'and "isActive"= ' +
        "'true'";

    const client = await DBConnection.getConnection();
    var res = await client.query(user);

    if (res && res.rowCount === 0) {
        resp = { "status": "FAIL", "message": "Invalid credentials" }
    }
    else if (res && res.rows && res.rows.length > 0) {
        var userDt = res.rows[0];

        var hash = bcrypt.compareSync(det.password, userDt.password);
        //console.log("Pswd Match:",hash);
        if (hash) {
            resp = {
                status: "SUCCESS",
                message: "Login successfully",
                userId: userDt.id,
                displayName: userDt.name
            };
        }
        else {
            resp = { "status": "FAIL", "message": "Invalid credentials" };
        }
    }

    client.end();
    return resp;

}
 async function resetPassword(det){

    var result ={}
    var userDetails = 'SELECT username,id from "mlcUsers" WHERE' +
    ' username = '+
    "'"+det.username+"'";

    var client = await DBConnection.getConnection();
    var resp = await client.query(userDetails);
    
    //console.log("First Resp:",resp);

    if(resp && resp.rowCount===1){
        var pass = bcrypt.hashSync(det.password, 8);
        var updatePassword = 'UPDATE "mlcUsers" SET ' +
        '"password" = ' +
        "'"+pass +
        "'" +
        " WHERE id= " +
        " '"+resp.rows[0].id+"'";

       
        var resp = await client.query(updatePassword);
        //console.log("response",resp);
        if(!resp){
            result = {"status" : "FAIL", "message": res}
        }
        else if (resp && resp.rowCount && resp.rowCount == 1){
   
            result = {"status" : "SUCCESS", "message": "password updated successfully"};
        }

    }
    else{
        result = {"status" : "FAIL", "message": "user not found"}
 
    }
    client.end()
    return result;
 }
module.exports = {createUser,userLogin,resetPassword}