
import {HeaderPage} from '../../common/mlcConstants';
import axios from 'axios';

function headerData(userId){
    //console.log("UserId is:",userId);
    return async function(dispatch) {
        var userDetails = {};
        // axios.post('/api/getUserDetails',{"userId": userId})
        //     .then(res => {
        //         console.log("RESP:", res);
        //         if (res && res.data && res.data.status) {
        //             if (res.data.status === "SUCCESS") {
        //                 userDetails = res.data.userDetails;
        //             }
        //             else if (res.data.status === "FAIL") {
        //                 alert(res.data.message);
        //             }
        //         }
        //     });

        return  dispatch({
            type : HeaderPage.HeaderData,
            payload : {"userDetails": userDetails}
        });
    }
}

export default {headerData};