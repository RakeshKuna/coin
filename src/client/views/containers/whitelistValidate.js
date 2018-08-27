import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Redirect } from 'react-router-dom';
import DatePicker from 'material-ui/DatePicker';
import axios from 'axios';
import moment from 'moment';
import ValidationsForm from '../../common/validations';
import MlcToaster from './mlcToatser';
export default class whitelistValidate extends Component {
    constructor(props){
        super(props);

        this.state ={
            emailId : '',
            regRecId : '',
            address : '',
            uniqueId : '',
            submittedValue : '',
            txHash : '',
            canRedirect : false,
            dateOfTransfer : new Date(),
            whiteLisFormErrors : {},
            isFormValid: true,
            canRedirectToTransferThanksPage : false,
            isFormSubmitted : false,
            "TC_1": false,
            "TC_2": false,
            "showToaster":false,
            "messageType":"",
            "messageTitle":"",
            "messageContent":""

        };

        this.tcOnChangeTC_1 = this.tcOnChangeTC_1.bind(this);
        this.tcOnChangeTC_2 = this.tcOnChangeTC_2.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onwhitelistChange = this.onwhitelistChange.bind(this);
        this.onWhiteListTransferSubmit = this.onWhiteListTransferSubmit.bind(this);
        this.onWhiteListSubmit = this.onWhiteListSubmit.bind(this);
        this.onETHValueKeyDown = this.onETHValueKeyDown.bind(this);
    }

    // setGender(e) {
    //     // console.log(e.currentTarget.value);
    //     $('.whitelisted').is(':checked'); {
    //         // alert('hi');
    //         $('.white-listed-sec').toggleClass('visibility');
    //         $('.white-list').toggleClass('visibility');
    //         // $('.white-listed-sec').slideDown();
    //     }
    // }
    onwhitelistChange(){
        $('.whitelisted').is(':checked'); {
            // alert('hi');
            $('.white-listed-sec').toggleClass('visibility');
            $('.white-list').toggleClass('visibility');
            $('.note-sec').toggleClass('active');
        }
    }
    tcOnChangeTC_1(e) {
        e.stopPropagation();
        //console.log("Name:",e.target.name+" && Value:",e.target.checked);
        this.setState({"TC_1": e.target.checked});
    }

    tcOnChangeTC_2(e) {
        e.stopPropagation();
        //console.log("Name:",e.target.name+" && Value:",e.target.checked);
        this.setState({"TC_2": e.target.checked});
    }
    onETHValueKeyDown(evt)
    {
        var enteredKey = $(evt.currentTarget).val();

        if (enteredKey) {
            enteredKey = enteredKey.replace(/[^0-9.]/g,'');

            this.setState({"submittedValue": enteredKey});
        }
        else{
            this.setState({"submittedValue": ''});
        }
    }
    onWhiteListTransferSubmit(e) {
        e.preventDefault();
        if(!this.state.isFormSubmitted) {

            this.setState({isFormSubmitted: true});

            var self = this;
            let whitelistDetails = {
                emailId: this.refs.emailId.value,
                //uniqueId: this.refs.uniqueId.value,
                address: this.refs.address.value,
                dateOfTransfer: this.state.dateOfTransfer,
                submittedValue: this.refs.submittedValue.value,
                txHash: this.refs.txHash.value,
                TC_1: false, TC_2: false,
            };
            whitelistDetails.TC_1 = this.state.TC_1;
            whitelistDetails.TC_2 = this.state.TC_2;
            var validation = ValidationsForm.whiteListFormValidator(whitelistDetails);

            if (!validation.isFormValid) {
                this.setState({"whiteLisFormErrors": validation.whiteLisFormErrors,"isFormSubmitted":false});
            }
            else {
                this.setState({"whiteLisFormErrors": {}});
                axios.post('/api/saveWhitelistFormDetails', whitelistDetails)
                    .then((req) => {
                        //console.log("WhiteList Data: ", req);
                        if (req && req.data && req.data.status === "SUCCESS") {
                            this.setState({isFormSubmitted: false});
                            self.setState({"canRedirectToTransferThanksPage":true});
                        }
                        else{
                            var msgCont = '';

                            if(req && req.data && req.data.status === "FAIL"){
                                msgCont = req.data.message;

                            }
                            else{
                                msgCont = "Something wrong, please try again.";
                            }

                            self.setState({isFormSubmitted: false,"showToaster":true,"messageType":"FAIL","messageTitle":"Error","messageContent": msgCont});

                            setTimeout(function(){
                                self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                            },3000);
                        }

                    })
            }
        }
        else{
            this.setState({"showToaster":true,"messageType":"INFO","messageTitle":"Info","messageContent":"Please wait."});
            //alert("Please wait.");
            setTimeout(function(){
                this.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
            },3000);

        }
    }
    onWhiteListSubmit(){
        this.setState({
            canRedirect : true
        })
    }
    onDateChange(e, selectedDate){
        // selectedDate = moment(moment(selectedDate).toDate()).format("DD/MM/YYYY");
        //console.log("Date is:",selectedDate);
        this.setState({"dateOfTransfer": selectedDate});
    }

    componentDidMount() {

    }

    render() {
        if(this.state.canRedirect){
            return <Redirect to ="/register"/>
        }
        if(this.state.canRedirectToTransferThanksPage){
            return <Redirect to='/transferThankyou' />
        }
        return (

            <div className="form-view-container white-list-sec">
                { this.state.showToaster === true? <MlcToaster messageType= {this.state.messageType} messageTitle={this.state.messageTitle} messageContent={this.state.messageContent}/> : ''}
                <div className="welcome-msg"> <p>Welcome to moolyacoin <span className="cust-text-1">Registration</span> /<span  className="cust-text-2"> Whitelisting</span> application.</p></div>
                <p className="cust-text-3">Select one of the options :</p>
                <div className="radio-btn-holder" >
                    <label className="custom-title"><input type="radio" defaultChecked onChange={this.onwhitelistChange} className="radio-inline" name="radios" value="whitelist" />
                        <span className="outside"><span className="inside"></span></span>Register for m<span className="color-text">oo</span>lyacoin ICO </label>
                    <div className="note-sec active">
                        <p>Please Note :</p>
                        <ul>
                            <li>Registration is mandatory for participation in our ICO</li>
                            <li>moolyacoins will be assigned only after you complete the KYC/AML verification.</li>
                            <li>You need to complete KYC within 30 days from date of opening of the KYC procedure</li>
                            <li>We have partnered with 'www.KYC3.com' for KYC/AML verifications</li>
                        </ul>
                    </div>
                    <label><input type="radio" onChange={this.onwhitelistChange}  className="radio-inline whitelisted" name="radios" value="whitelisted"/>
                        <span className="outside"><span className="inside"></span></span>I have already transferred ETH to moolyacoin smart contract</label>
                   {/* <p className="temp">This option will be activated shortly</p> */}
                    <div className="note-sec">
                        <p>Please Note :</p>
                        <ul>
                            <li>We will need your correct Tx Hash. Please verify this before submitting</li>
                            <li>Ensure that you have transferred the ETH from your registered public address ONLY</li>
                            <li>The moolyacoins will be assigned to you only after the KYC/AML verification is completed and cleared</li>
                            <li>We will refund the ETH for users who fail the KYC/AML checks to the same public address within 20 days of KYC/AML check</li>
                        </ul>
                    </div>
                </div>
                <div className="btns-holder white-list">

                    <a href="https://register.moolyacoin.io/"><button type="submit" className="cmn-btn ">Submit</button></a>

                    {/*<button type="submit" className="cmn-btn " onClick={this.onWhiteListSubmit}>Submit</button>*/}

                </div>
                <div className="white-listed-sec visibility">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="fname">Registered e-mail id :</label>
                                <input type="text" className="form-control" ref="emailId" placeholder="Registered e-mail id" />
                                <label className="error-msg invalid">{this.state.whiteLisFormErrors.emailId}</label>
                            </div>
                        </div>
                        {/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">*/}
                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="fname">Registration Unique Id : (Assigned after whitelisting)</label>*/}
                                {/*<input type="text" className="form-control" ref="uniqueId" placeholder="MLCO9---------" />*/}
                                {/*<label className="error-msg invalid">{this.state.whiteLisFormErrors.uniqueId}</label>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="fname">ETH Transferred by you :</label>
                                <input type="text" className="form-control" ref = "submittedValue" placeholder="0.00"  value={this.state.submittedValue} onChange={this.onETHValueKeyDown}/>

                                <label className="error-msg invalid">{this.state.whiteLisFormErrors.ethTransfered}</label>
                            </div>
                        </div>
                        <div className="clear-fix"></div>

                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="fname">Date of transfer :</label>
                                {/* <input type="text" className="form-control" placeholder="DD-MM-YYYY" /> */}
                                <MuiThemeProvider>
                                    <DatePicker className="date-picker" ref= "dateOfTransfer" onChange={this.onDateChange} formatDate={(date) => moment(date).format('DD/MM/YYYY')} value={this.state.dateOfTransfer} maxDate={new Date()} hintText="DD/MM/YYYY"  />
                                </MuiThemeProvider>
                                <label className="error-msg invalid">{this.state.whiteLisFormErrors.dateOfTransfer}</label>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="fname">Your Cryptowallet Public Address (Where you sent the ETH from):</label>
                                <input type="text" className="form-control" ref="address" placeholder="Enter public address starting with 0x"  maxLength="42"/>
                                <label className="error-msg invalid">{this.state.whiteLisFormErrors.address}</label>
                            </div>
                        </div>
                        <div className="clear-fix"></div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="fname">Tx hash for the transfer :</label>
                                <input type="text" className="form-control" ref="txHash" placeholder="Tx hash for the transfer" />
                                <label className="error-msg invalid">{this.state.whiteLisFormErrors.txHash}</label>
                            </div>
                        </div>
                        <div className="clear-fix"></div>
                        <div className="checkbox-container">
                            <div className="chiller_cb">
                                <input id="myCheckbox" type="checkbox" ref="TC_1" onChange={this.tcOnChangeTC_1}/>
                                <label htmlFor="myCheckbox">
                                    I hereby expressly confirm that the details mentioned in this form, by me, are accurate and valid and I will bear all consequences of any errors or omissions, while indemnifying moolya and its team members at all times, in this regard.
                                </label >
                                <span></span>
                            </div>
                            <div className="chiller_cb">
                                <input id="myCheckbox2" type="checkbox" ref="TC_2" onChange={this.tcOnChangeTC_2}/>
                                <label htmlFor="myCheckbox2">
                                    I hereby confirm that I am over 18 years of age and not a minor.
                                </label>
                                <span></span>
                            </div>
                            <label className="error-msg invalid">{this.state.whiteLisFormErrors.TC}</label>
                        </div>
                    </div>
                    <div className="btns-holder">
                        <button type="submit" className="cmn-btn " onClick={this.onWhiteListTransferSubmit}>Submit</button>
                    </div>
                </div>
                {/*<div className="mcaffe-holder">*/}
                    {/*<a target="_blank" href="https://mcafeesecure.com/verify?host=whitelist.moolyacoin.io"><img className="mfes-trustmark" border="0" src="https://cdn.ywxi.net/meter/whitelist.moolyacoin.io/102.gif?w=186" width="93" height="38" title="McAfee SECURE sites help keep you safe from identity theft, credit card fraud, spyware, spam, viruses and online scams" alt="McAfee SECURE sites help keep you safe from identity theft, credit card fraud, spyware, spam, viruses and online scams" /></a>*/}
                {/*</div>*/}
            </div>
        )
    }
}