import { fromJS } from 'immutable';
import {LoginPage} from '../../common/mlcConstants';

const initialState = fromJS({
    "username":"",
    "userId" :"",
    "displayName":""
});

function LoginReducer(state = initialState, { type, payload }) {
    // console.log("Type:", type);
    // console.log("Payload:",payload);
    // console.log("State:",state);

    switch (type) {
        case LoginPage.LoginData:
                            //console.log("Iam in Login Data reduc.");
                            var retDt = Object.assign({},state,{
                                "username": payload.username,
                                "userId": payload.userId,
                                "displayName" : payload.displayName
                            });
                            //console.log("Before return:", retDt);
                            return retDt;
                            break;

        case LoginPage.LogoutData:
                            //console.log("Iam in Logout Data reduc.");
                            var retDt = Object.assign({},state,{
                                "username": payload.username,
                                "userId": payload.userId,
                                "displayName" : payload.displayName
                            });
                            //console.log("Before return:", retDt);
                            return retDt;
                            break;

        default:
            return state;
    }
};

export default  LoginReducer;