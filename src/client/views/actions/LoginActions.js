
import {LoginPage} from '../../common/mlcConstants';
import axios from "axios";

function loginData(username, userId, displayName){
    return function(dispatch) {
        return  dispatch({
            type : LoginPage.LoginData,
            payload : {"username": username,"userId": userId,"displayName":displayName}
        });
    }
}

function logoutData(userId){
    return async function(dispatch) {
        axios.post('/api/logout',{userId:userId})
            .then(res=>{
                //console.log("response",res);
            });

        return  dispatch({
            type : LoginPage.LogoutData,
            payload : {"username": '',"userId": '',"displayName":''}
        });
    }
}

export default {loginData, logoutData};