import React, { Component } from 'react';
import axios from 'axios';
import Validations from '../../common/validations';
import { Redirect } from 'react-router-dom';
import _ from 'underscore';
import Select from 'react-select';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CustomHeader from '../layouts/customHeader';
import CustomFooter from '../layouts/customFooter';
import MlcToaster from './mlcToatser';

export default class secondaryRegistration extends Component {
    constructor() {
        super();
        this.onSave = this.onSave.bind(this);
        this.isNumberKey = this.isNumberKey.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.setContactNumberCode =  this.setContactNumberCode.bind(this);
        this.state = {
            Name: '',
            countryId: '',
            emailId: '',
            contactNumber: '',
            countriesList: [],
            errors: {},
            canRedirectToThankyouPage:false,
            isFormValid: true,
            isFormSubmitted: false,
            "showToaster":false,
            "messageType":"",
            "messageTitle":"",
            "messageContent":""
        };
    };
    isNumberKey(evt) {
        var enteredKey = $(evt.currentTarget).val();

        if (enteredKey) {
            enteredKey = enteredKey.replace(/[^0-9]/g, '');
            this.setState({ "contactNumber": enteredKey });
        }
        else {
            this.setState({ "contactNumber": '' });
        }
    }
    onCountryChange(e) {
      //  console.log("selected value", e);

        if(e && e.value){
            this.setState({"countryId": e.value});
            this.setContactNumberCode(e.value);
        }
        else{
            this.setState({"countryId": ""});
            this.setContactNumberCode("");
        }
    }

    setContactNumberCode(countryId){
        if(countryId){
            var countryRec =_.findWhere(this.state.countriesList,{"id": countryId});
           // console.log("Country Dt:",countryRec);
            if(countryRec && countryRec.phonenumbercode){
                this.setState({"contactNumberCode": countryRec.phonenumbercode});
            }
            else{
                this.setState({"contactNumberCode": "+00"});
            }
        }
        else{
            this.setState({"contactNumberCode": "+00"});
        }

    }
    onSave(e) {
        e.preventDefault();

        if (!this.state.isFormSubmitted) {
            this.setState({ isFormSubmitted: true });

            var self = this;
            let regDet = {
                Name: this.refs.Name.value,
                emailId: this.refs.emailId.value,
                countryId: this.state.countryId,
                contactNumber: this.refs.contactNumber.value
            };


          
            var validres = Validations.secondaryRegistrationValidation(regDet);
            //console.log("response", validres);

            if (!validres.isFormValid) {
                this.setState({ "errors": validres.secondaryRegistrationValidation, "isFormValid": false });
                this.setState({ isFormSubmitted: false });
            }
            else {
                this.setState({ "errors": {}, "isFormValid": true });
                //console.log("No errors.");
                axios.post("/api/saveSecondaryRegistrationDetails", regDet)
                    .then((result) => {
                       // console.log("Save Resp is:", result);
                        if (result && result.data && result.data.status === "SUCCESS") {
                            self.setState({isFormSubmitted: false});
                            self.setState({"canRedirectToThankyouPage":true});
                            //window.location = "https://register.moolyacoin.io";

                        }
                        else{
                                var msgCont = '';

                                if(result && result.data && result.data.status === "FAIL"){
                                    msgCont = result.data.message;

                                }
                                else{
                                    msgCont = "Something wrong, please try again.";
                                }

                                self.setState({isFormSubmitted: false,"showToaster":true,"messageType":"FAIL","messageTitle":"Error","messageContent": msgCont});

                                setTimeout(function(){
                                    self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                                },3000);
                        }

                    });
            }
        }
    }

    componentDidMount() {
        var self = this;
        axios.get("/api/getCountriesList")
            .then((response) => {
                self.setState({ "countriesList": response.data.countriesList });
                //console.log("Resp is:", response)
            });
    }

    render() {
        if (this.state.canRedirectToThankyouPage) {
            return <Redirect to='/secRegThanks' />
        }

        //console.log("State values are:",this.state);
        let countriesList = this.state.countriesList;
        let ctl = [];
        if (countriesList && countriesList.length > 0) {
            for (var k = 0; k < countriesList.length; k++) {
                ctl.push({ "value": countriesList[k].id, "label": countriesList[k].displayname });
            }
        }
        return (
            <div>
            {/*<div className="reg-container dark-theme">
                <CustomHeader />

                <div className="reg-content-section">*/}
                <div className="custom-login">
                    <a href="https://register.moolyacoin.io">L</a>
                </div>
                    <div className="page-title">ICO Registration <span>(All fields are mandatory)</span></div>
                    <div className="form-view-container">
                        { this.state.showToaster === true? <MlcToaster messageType= {this.state.messageType} messageTitle={this.state.messageTitle} messageContent={this.state.messageContent}/> : ''}
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">Name </label>
                                    <input type="text" className="form-control" placeholder="Enter Your Name"
                                        ref="Name" />
                                    <label className="error-msg invalid">{this.state.errors.Name}</label></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">Country Of Residence</label>
                                    <Select id="country" name="country" options={ctl}
                                        value={this.state.countryId} onChange={this.onCountryChange}
                                        placeholder='Choose Country' />
                                    <label className="error-msg invalid">{this.state.errors.countryId}</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="email">Email id: (Will be used for all further
                                        communication/updates)</label>
                                    <input type="email" required className="form-control" placeholder="Email"
                                        ref="emailId" />
                                    <label className="error-msg invalid">{this.state.errors.emailId}</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div>
                                    <label className="custom-lbl" htmlFor="phone">Telephone / Mobile No:</label>

                                </div>

                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 pl0 pr5">
                                    <div className="form-group">
                                        <input type="text" disabled className="form-control" defaultValue="+ 00" value={this.state.contactNumberCode}
                                            placeholder="code" />

                                    </div>
                                </div>
                                <div className="col-lg-10 col-md-10 col-sm-9 col-xs-9 pl0 pr0">
                                    <div className="form-group">
                                        <input type="text" required className="form-control" tabIndex="0" maxLength="15"
                                            placeholder="Telephone / Mobile" ref="contactNumber"
                                            onChange={this.isNumberKey} value={this.state.contactNumber} />
                                        <label className="error-msg invalid">{this.state.errors.contactNumber}</label>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            {this.state.isFormValid ? '' :
                                <label className="error-msg invalid">
                                    All values in this Whitelisting form are mandatory. Please fill all the fields and upload the KYC documents. Incorrect forms may be rejected.
                                  </label>
                            }
                        </div>
                        <div className="clear-fix"></div>
                        <div className="btns-holder">
                            <button type="submit" className="cmn-btn " onClick={this.onSave}>I am interested</button>
                        </div>
                    </div>
                    {/*<CustomFooter />
                </div>*/}
            </div>
        );
    }
}
