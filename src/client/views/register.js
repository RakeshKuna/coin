import React, {Component} from 'react';
import axios from 'axios';
import ValidationsForm from '../common/validations';
import { Redirect } from 'react-router-dom';
import _ from 'underscore';
import Select from 'react-select';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
//var Recaptcha = require('react-recaptcha');
import CustomHeader from '../views/layouts/customHeader';
import CustomFooter from '../views/layouts/customFooter';
import moment from "moment/moment";
import RecaptchaComponent from '../views/containers/RecaptchaComponent';


export default class register extends Component {
    constructor() {
        super();
        this.onSave = this.onSave.bind(this);
        this.handleClick = this.handleClick.bind(this);
        // this.selectKYCDoc = this.selectKYCDoc.bind(this);
        this.tcOnChangeTC_1 = this.tcOnChangeTC_1.bind(this);
        this.tcOnChangeTC_2 = this.tcOnChangeTC_2.bind(this);
        this.tcOnChangeTC_3 = this.tcOnChangeTC_3.bind(this);
        this.tcOnChangeTC_4 = this.tcOnChangeTC_4.bind(this);
        this.tcOnChangeTC_5 = this.tcOnChangeTC_5.bind(this);

        this.onCountryChange = this.onCountryChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.getCities = this.getCities.bind(this);
        this.onCitizenTypeChange = this.onCitizenTypeChange.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.isNumberKey = this.isNumberKey.bind(this);
        this.onETHValueKeyDown = this.onETHValueKeyDown.bind(this);
        this.setContactNumberCode =  this.setContactNumberCode.bind(this);
        this.onChangeOfDOB = this.onChangeOfDOB.bind(this);
        this.saveSelectedCaptcha = this.saveSelectedCaptcha.bind(this);

        this.state = {
            // "KYCDoc": "",
            "TC_1": false, "TC_2": false, "TC_3": false, "TC_4": false,"TC_5": false,
            firstName: '',
            lastName: '',
            gender: '',
            contactNumber: '',
            countryId: '',
            cityId: '',
            citizenshipId: '',
            address_1: '',
            address_2: '',
            emailId: '',
            countriesList: [],
            citiesList: [],
            // citizenshipList: [],
            errors: [],
            canRedirectToLogin : false,
            canRedirectToThanksPage : false,
            ethValue : '',
            contactNumberCode : "+00",
            isFormValid : true,
            isFormSubmitted : false
        };
    };
    saveSelectedCaptcha(e){
        console.log("Captach is:",e);
    }
    onChangeOfDOB(e, selectedDate){
        //console.log("Date is:",selectedDate);
        this.setState({"dateOfBirth": selectedDate});
        //console.log("Diff is:",moment().diff(selectedDate, 'years'));
    }
    handleClick(e) {
        e.preventDefault();
        this.props.history.push('/landing');
    };
    isNumberKey(evt)
    {
         var enteredKey = $(evt.currentTarget).val();

        if (enteredKey) {
            enteredKey = enteredKey.replace(/[^0-9]/g,'');
            this.setState({"contactNumber": enteredKey});
        }
        else{
            this.setState({"contactNumber": ''});
        }
    }
    onETHValueKeyDown(evt)
    {
        var enteredKey = $(evt.currentTarget).val();

        if (enteredKey) {
            enteredKey = enteredKey.replace(/[^0-9.]/g,'');
            //enteredKey = enteredKey.toFixed(2);
            this.setState({"ethValue": enteredKey});
        }
        else{
            this.setState({"ethValue": ''});
        }
    }
    // selectKYCDoc(e) {
    //     //console.log("Selected Doc:",$(e.currentTarget).val());
    //     this.setState({"KYCDoc": $(e.currentTarget).val()});
    // }

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

    tcOnChangeTC_3(e) {
        e.stopPropagation();
        //console.log("Name:",e.target.name+" && Value:",e.target.checked);
        this.setState({"TC_3": e.target.checked});
    }

    tcOnChangeTC_4(e) {
        e.stopPropagation();
        //console.log("Name:",e.target.name+" && Value:",e.target.checked);
        this.setState({"TC_4": e.target.checked});
    }
    tcOnChangeTC_5(e) {
        e.stopPropagation();
        //console.log("Name:",e.target.name+" && Value:",e.target.checked);
        this.setState({"TC_5": e.target.checked});
    }
    onLoginClick(e){
        e.stopPropagation();
        this.setState({canRedirectToLogin: true});
        //this.props.history.push('/login');

    }
    onSave(e) {
        e.preventDefault();

        if(!this.state.isFormSubmitted){
            this.setState({isFormSubmitted: true});

            var self = this;
            let regDet = {
                firstName: this.refs.firstName.value,
                lastName: this.refs.lastName.value,
                emailId: this.refs.emailId.value,
                gender: this.refs.gender.value,
                countryId: this.state.countryId,
                cityId: this.state.cityId,
                citizenshipId: this.state.citizenshipId,
                contactNumber: this.refs.contactNumber.value,
                address_1: this.refs.address_1.value,
                address_2: this.refs.address_2.value,
                // typeofKYCDoc: this.state.KYCDoc,
                TC_1: false, TC_2: false, TC_3: false, TC_4: false,TC_5:false,
                ethValue: this.refs.ethValue.value,
                dateOfBirth : this.state.dateOfBirth,
                sourceOfFunds : this.refs.sourceOfFunds.value
            };

            regDet.TC_1 = this.state.TC_1;
            regDet.TC_2 = this.state.TC_2;
            regDet.TC_3 = this.state.TC_3;
            regDet.TC_4 = this.state.TC_4;
            regDet.TC_5 = this.state.TC_5;
            regDet.selectedCaptch = grecaptcha.getResponse();

            //console.log("Data is:",regDet.selectedCaptch);

            const formData = new FormData();
            formData.append("regDetails", JSON.stringify(regDet));
            // formData.append('file1', this.uploadInput1.files[0]);
            // formData.append('file2', this.uploadInput2.files[0]);

            var validaReqData = regDet;
            // validaReqData.file1 = this.uploadInput1.files[0];
            // validaReqData.file2 = this.uploadInput2.files[0];
            var validres = ValidationsForm.validate(validaReqData);
            //console.log("response", validres);

            if (!validres.isFormValid) {
                this.setState({"errors": validres.errors,"isFormValid": false});
                this.setState({isFormSubmitted: false});
            }
            else
                {
                this.setState({"errors": {},"isFormValid": true});
                //console.log("No errors.");
                axios.post("/api/save", formData)
                    .then((result) => {
                        //console.log("Save Resp is:", result);
                        if (result && result.data && result.data.status === "SUCCESS") {
                            this.setState({isFormSubmitted: false});
                            self.setState({"canRedirectToThanksPage":true});
                        }
                        else if(result && result.data && result.data.status === "FAIL"){
                            this.setState({isFormSubmitted: false});
                            alert("Message : "+result.data.message);
                        }
                        else{
                            this.setState({isFormSubmitted: false});
                            alert("Something wrong, please try again.");
                        }
                    });
            }
        }
        else{
            alert("Please wait.");
        }

    }

    componentDidMount() {
        var self = this;
        axios.get("/api/countriesList")
            .then((response) => {
                self.setState({"countriesList": response.data.countriesList});
                //console.log("Resp is:", response)
            });
        // axios.get("/api/citizenshipList")
        //     .then((response) => {
        //         self.setState({"citizenshipList": response.data.citizenshipList})
        //         console.log("Resp is:", response)
        //     });
    }

    onCountryChange(e) {
        if(e && e.value){
            this.setState({"countryId": e.value});
            //console.log("selected value", e.value);
            this.getCities(e.value);
            this.setContactNumberCode(e.value);
        }
        else{
            this.setState({"countryId": ""});
            this.getCities("");
            this.setContactNumberCode("");
        }
    }


    setContactNumberCode(countryId){
        if(countryId){
            var countryRec =_.findWhere(this.state.countriesList,{"_id": countryId});

            if(countryRec && countryRec.phoneNumberCode){
                this.setState({"contactNumberCode": countryRec.phoneNumberCode});
            }
            else{
                this.setState({"contactNumberCode": "+00"});
            }
        }
        else{
            this.setState({"contactNumberCode": "+00"});
        }

    }

    getCities(countryId) {
        var self = this;
        if(countryId){
            axios.post("/api/citiesList", {"countryId": countryId})
                .then((response) => {
                    self.setState({"citiesList": response.data.citiesList});
                    //console.log("Resp of cities:", response)
                });
        }
        else{
            self.setState({"citiesList": []});
        }
    }

    onCityChange(e) {
        if(e && e.value){
            this.setState({"cityId": e.value});
            //console.log("Selected City", e.value);
        }
        else{
            this.setState({"cityId": ""});
        }

    }

    onCitizenTypeChange(e) {
        if(e && e.value){
            this.setState({"citizenshipId": e.value});
            //console.log("Selected Values", e.value);
        }
        else{
            this.setState({"citizenshipId": ''});
        }

    }

    render() {
        if(this.state.canRedirectToLogin){
            return <Redirect to='/login' />
        }

        if(this.state.canRedirectToThanksPage){
            return <Redirect to='/thanks' />
        }

        //console.log("State values are:",this.state);
        let countriesList = this.state.countriesList;
        let citiesList = this.state.citiesList;
        // let citizenshipList = this.state.citizenshipList;
        let ctl = [];
        let cities = [];
        // let citizenships = [];
        if (countriesList && countriesList.length > 0) {
            for (var k = 0; k < countriesList.length; k++) {
                ctl.push({"value": countriesList[k]._id, "label": countriesList[k].displayName});
            }
        }
        if (citiesList && citiesList.length > 0) {
            for (var c = 0; c < citiesList.length; c++) {
                cities.push({"value": citiesList[c]._id, "label": citiesList[c].name});
            }
        }
        // if (citizenshipList && citizenshipList.length > 0) {
        //     for (var s = 0; s < citizenshipList.length; s++) {
        //         citizenships.push({
        //             "value": citizenshipList[s]._id,
        //             "label": citizenshipList[s].citizenshipTypeDisplayName
        //         });
        //     }
        // }
        return (
            <div className="reg-container dark-theme">
                <CustomHeader />

                <div className="reg-content-section">
                    <div id="myModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">

                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    {/* <h4 className="modal-title">Modal Header</h4> */}
                                </div>
                                <div className="modal-body">
                                    <p> Please email us at <span className="emai-txt">‘backers@moolyacoin.io’</span> if you face any issue with this whitelisting form. We will strive to respond back as soon as possible.</p>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="modal fade" id="upload-files" tabIndex="-1" role="dialog"
                         aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header custom-hdr">
                                    <p className="page-heading">Upload Files</p>

                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span className="fa fa-times-circle" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <input type="file" className="form-control upload-file" id="images" name="images[]"
                                           onChange="preview_images();" multiple/>

                                    <div className="flex-row" id="image_preview">

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <ul className="custom-btns">
                                        <li>
                                            <button type="submit" data-dismiss="modal" className="cmn-btn">Cancel
                                            </button>
                                        </li>
                                        <li>
                                            <button className="cmn-btn style-2">Upload</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="page-title">Whitelisting Form <span>(All fields are mandatory)</span></div>
                    <div className="form-view-container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">First Name </label>
                                    <input type="text" className="form-control" placeholder="First Name"
                                           ref="firstName"/>
                                    <label className="error-msg invalid">{this.state.errors.firstName}</label></div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">Last Name </label>
                                    <input type="text" required className="form-control" placeholder="Last Name"
                                           ref="lastName"/>
                                    <label className="error-msg invalid">{this.state.errors.lastName}</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">Select Gender</label>
                                    <select className="form-control" id="gender" name="gender" ref="gender">
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHERS">Others</option>
                                    </select>
                                    <label className="error-msg invalid">{this.state.errors.gender}</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">Country Of Residence</label>
                                    <Select id="country" name="country" options={ctl}
                                            value={this.state.countryId} onChange={this.onCountryChange}
                                            placeholder='Choose Country'/>
                                    <label className="error-msg invalid">{this.state.errors.countryId}</label>
                                </div>
                            </div>
                            <div className="clear-fix"></div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">City of Residence</label>
                                    <Select options={cities} id="country" name="country" placeholder='Select City'
                                            value={this.state.cityId} onChange={this.onCityChange}/>
                                    <label className="error-msg invalid">{this.state.errors.cityId}</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="fname">Citizenship</label>
                                    <Select id="citizen" name="citizen" options={ctl}
                                            value={this.state.citizenshipId} placeholder="Select Country Of Citizenship"
                                            onChange={this.onCitizenTypeChange}/>
                                    <label className="error-msg invalid">{this.state.errors.citizenshipId}</label>
                                </div>
                            </div>
                            <div className="clear-fix"></div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="email">Email id: (Will be used for all further
                                        communication/updates)</label>
                                    <input type="email" required className="form-control" placeholder="Email"
                                           ref="emailId"/>
                                    <label className="error-msg invalid">{this.state.errors.emailId}</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                 <div>
                                    <label className="custom-lbl" htmlFor="phone">Telephone / Mobile No:</label>

                                </div>

                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 pl0 pr5">
                                    <div className="form-group">
                                        <input type="text" disabled className="form-control" defaultValue="+ 00" value={this.state.contactNumberCode}
                                               placeholder="code"/>

                                    </div>
                                </div>
                                <div className="col-lg-10 col-md-10 col-sm-9 col-xs-9 pl0 pr0">
                                    <div className="form-group">
                                        <input type="text" required className="form-control" tabIndex="0" maxLength="15"
                                               placeholder="Telephone / Mobile" ref="contactNumber"
                                               onChange={this.isNumberKey} value={this.state.contactNumber}/>
                                        <label className="error-msg invalid">{this.state.errors.contactNumber}</label>

                                    </div>
                                </div>
                            </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group">
                                        <label htmlFor="address"> Address </label>
                                        <input type="text" required className="form-control"
                                               placeholder="Address" ref="address_1"/>
                                        <label className="error-msg invalid">{this.state.errors.address_1}</label>
                                    </div>
                                </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="address">Your Ether Cryptowallet Public Address: (Send
                                        ETH for this coin sale ONLY from this address)</label>
                                    <input type="text" required className="form-control" maxLength="42"
                                           placeholder="Enter the PUBLIC Address of your Cryptowallet starting with 0x" ref="address_2"/>
                                    <label className="error-msg invalid">{this.state.errors.address_2}</label>
                                </div>
                            </div>
                            <div className="clear-fix"></div>

                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="address">Your tentative ETH contribution (Minimum: 0.20 ETH, Enter approx.value upto 2 decimals)</label>
                                    <input type="text" required className="form-control" value={this.state.ethValue}
                                           placeholder="0.00" ref="ethValue" onChange={this.onETHValueKeyDown}/>
                                    <label className="error-msg invalid">{this.state.errors.ethValue}</label>
                                </div>
                                <div className="clear-fix"></div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="address">Date of Birth: (DD/MM/YYYY)</label>
                                    <MuiThemeProvider>
                                        <DatePicker className="date-picker" hintText="DD/MM/YYYY" maxDate={new Date()} onChange={this.onChangeOfDOB} formatDate={(date) => moment(date).format('DD/MM/YYYY')} value={this.state.dateOfBirth} hintText="DD/MM/YYYY" />
                                    </MuiThemeProvider>

                                    {/*<input type="text" required className="form-control"*/}
                                           {/*placeholder="DD/MM/YYYY" ref="dateOfBirth"/>*/}
                                    <label className="error-msg invalid">{this.state.errors.dateOfBirth}</label>
                                </div>

                            </div>
                            <div className="clear-fix"></div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label htmlFor="sourceOfFunds">Sources of Funds:</label>

                                    <select className="form-control" id="sourceOfFunds" name="sourceOfFunds" ref="sourceOfFunds">
                                        <option value="">Select Source of funds</option>
                                        <option value="SAVINGS">Savings</option>
                                        <option value="SUBSIDIES">Subsidies</option>
                                        <option value="CREDIT">Credit</option>
                                        <option value="VENTURE_CAPITAL">Venture capital</option>
                                        <option value="DONATIONS">Donations</option>
                                        <option value="GRANTS">Grants</option>
                                        <option value="TAXES">Taxes</option>
                                    </select>

                                    <label className="error-msg invalid">{this.state.errors.sourceOfFunds}</label>
                                </div>
                                <div className="clear-fix"></div>
                            </div>
                            <div className="clear-fix"></div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                &nbsp;

                            </div>

                            <div className="clear-fix"></div>

                            <div className="col-lg-12 col-md-12 col-sm-12 custom-margin">
                                <a href="https://www.youtube.com/watch?v=phht73IvUDI" target="_blank"
                                   className="video-url">Click here for Video on creating a ‘Cryptowallet for ETH'</a>

                                <p className="disc-txt">Disclaimer:</p>
                                <p className="disc-val">* Please ensure you take adequate online security, check the
                                    website URL correctly, use a secured laptop and do not access the cryptowallets from
                                    public WIFI or public computers.</p>
                            </div>
                            {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">*/}
                                {/*<div className="form-group">*/}
                                    {/*<label htmlFor="phone"> Type of KYC document: </label>*/}
                                    {/*<div className="radio-btn-holder">*/}
                                        {/*<label>*/}
                                            {/*<input type="radio" className="radio-inline" name="KYCDoc" value="PASSPORT"*/}
                                                   {/*onChange={this.selectKYCDoc}/>*/}
                                            {/*<span className="outside"><span className="inside"></span></span>Passport.*/}
                                        {/*</label>*/}
                                        {/*<label>*/}
                                            {/*<input type="radio" className="radio-inline" name="KYCDoc" value="DRV_LIC"*/}
                                                   {/*onChange={this.selectKYCDoc}/>*/}
                                            {/*<span className="outside"><span className="inside"></span></span>*/}
                                            {/*Driving License.*/}
                                        {/*</label>*/}
                                    {/*</div>*/}
                                    {/*<label className="error-msg invalid">{this.state.errors.typeofKYCDoc}</label>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">*/}
                                {/*<div className="form-group">*/}
                                    {/*<label htmlFor="address">Upload KYC Document Page/Side 1 (ONLY .jpg, .png, .pdf:*/}
                                        {/*Less than 1.5 MB)</label>*/}
                                    {/*<div className="upload-holder">*/}
                                        {/*<input ref={(ref) => {*/}
                                            {/*this.uploadInput1 = ref;*/}
                                        {/*}} type="file"/>*/}
                                        {/*/!*<button type="button" data-toggle="modal" data-target="#upload-files">Upload Files<span className="fa fa-upload"> </span> </button>*!/*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<label className="error-msg invalid">{this.state.errors.file1}</label>*/}

                            {/*</div>*/}
                            {/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">*/}
                                {/*<div className="form-group">*/}
                                    {/*<label htmlFor="address">Upload KYC Document Page/Side 2 (ONLY .jpg, .png, .pdf:*/}
                                        {/*Less than 1.5 MB)</label>*/}
                                    {/*<div className="upload-holder">*/}
                                        {/*<input ref={(ref) => {*/}
                                            {/*this.uploadInput2 = ref;*/}
                                        {/*}} type="file"/>*/}
                                        {/*/!*<button type="button" data-toggle="modal" data-target="#upload-files">Upload Files<span className="fa fa-upload"> </span> </button>*!/*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<label className="error-msg invalid">{this.state.errors.file2}</label>*/}
                            {/*</div>*/}

                            <div className="clear-fix"></div>
                        </div>
                        <div className="checkbox-container">
                            <div className="chiller_cb">
                                <input id="TC_1" type="checkbox" ref="TC_1" name="TC_1" onChange={this.tcOnChangeTC_1}/>
                                <label htmlFor="TC_1">
                                    I hereby expressly confirm that the details mentioned in this form, by me, are
                                    accurate and valid and
                                    I will bear all consequences of any errors or omissions, while indemnifying moolya
                                    and its team members at all times, in this regard.
                                </label>
                                <span></span>
                            </div>

                            <div className="chiller_cb">
                                <input id="TC_2" type="checkbox" ref="TC_2" name="TC_2" onChange={this.tcOnChangeTC_2}/>
                                <label htmlFor="TC_2">
                                    I hereby expressly agree that I have perused the latest version of the Whitepaper,
                                    published in this website and have understood and agree to them in their
                                    entiriety. </label>
                                <span></span>
                            </div>

                            <div className="chiller_cb">
                                <input id="TC_3" type="checkbox" ref="TC_3" name="TC_3" onChange={this.tcOnChangeTC_3}/>
                                <label htmlFor="TC_3">
                                    I hereby expressly agree to the latest terms and conditions of this coin sale as
                                    mentioned in this website and the privacy terms.
                                </label>
                                <span></span>
                            </div>
                            <div className="chiller_cb">
                                <input id="TC_4" type="checkbox" ref="TC_4" name="TC_4" onChange={this.tcOnChangeTC_4}/>
                                <label htmlFor="TC_4">
                                    I hereby expressly agree that I am NOT an unaccredited investor or a retail investor who
                                    holds citizenship of United States of America or the People Republic of China. I
                                    have checked and verified from the local government authorities/officials that I can
                                    invest in this coin sale.
                                </label>
                                <span></span>
                            </div>

                            <div className="chiller_cb">
                                <input id="TC_5" type="checkbox" ref="TC_5" name="TC_5" onChange={this.tcOnChangeTC_5}/>
                                <label htmlFor="TC_5">
                                    I hereby confirm that I am over 18 years of age and not a minor.
                                </label>
                                <span></span>
                            </div>

                            <label className="error-msg invalid">{this.state.errors.TC}</label>

                        </div>
                        <div className="clear-fix"></div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            {this.state.isFormValid ? '' :
                                  <label className="error-msg invalid">
                                        All values in this Whitelisting form are mandatory. Please fill all the fields and upload the KYC documents. Incorrect forms may be rejected.
                                  </label>
                            }
                        </div>
                        <div className="clear-fix"></div>

                        <RecaptchaComponent/>

                        <div className="clear-fix"></div>

                        <div className="btns-holder">
                            <button type="submit" className="cmn-btn " onClick={this.onSave}>Submit</button>
                            <button type="submit" className="cmn-btn ">Cancel</button>
                        </div>
                    </div>
                    <CustomFooter />
                </div>

            </div>
        );
    }
}
