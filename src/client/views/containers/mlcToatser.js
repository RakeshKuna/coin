import React,{ Component } from 'react';

import toastr from 'reactjs-toastr';
import 'reactjs-toastr/lib/toast.css';

export default class MlcToaster extends Component {
    constructor(props){
        super(props);

    }
    componentWillMount(){

    }

    render(){
        //console.log("Props are:", this.props);

            // To clear toaster.
        $("#toast-container").html("");


        let {messageType,messageTitle,messageContent} = this.props;
        var toasterDt = '';

        if(messageType == "SUCCESS"){
            toasterDt = toastr.success(messageContent, messageTitle, {displayDuration:3000});
        }
        else if(messageType === "FAIL"){
            toasterDt = toastr.error(messageContent, messageTitle, {displayDuration:3000});
        }
        else if(messageType === "INFO"){
            toasterDt = toastr.info(messageContent, messageTitle, {displayDuration:3000});
        }

        return(
            <div>
                {toasterDt}
            </div>
        )
    }
}