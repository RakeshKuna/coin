import React, {Component} from 'react';
var ReCAPTCHA = require("react-recaptcha");

export default class RecaptchaComponent extends Component{
    constructor(props){
        super(props);
        //console.log("Iam in Recaptcha..");
    }

    render(){
        return(
            <div>
            <ReCAPTCHA ref="reCaptchaRef" sitekey="6LfU718UAAAAADK-Qp9_SrCW-A11uZNMNlUpn3n2"  />
            </div>
        )
    }
}