import React, { Component } from 'react';
import $ from 'jquery';
import 'lightgallery';
import 'lg-zoom';
import 'lg-fullscreen';
import 'lg-thumbnail';
import _ from 'underscore';

import axios from 'axios';
import DetailsComponent from "./DetailsComponent";
import MlcConfigurations from '../../../client/common/mlcConfigurations';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Loading from '../loader';
import MlcToaster from './mlcToatser';

//import loginActions from "../actions/LoginActions";

class ListingPage extends Component{
    constructor(props) {
        super(props);
        //console.log("Page is:",this.props.match.params.pageName);
        this.state  = {
            "regData": {},
            "pageName": this.props.match.params.pageName,
            "actionButtonsSettings": [],
            additionalInfoFileUploadErrors: {},
            loading: false,
            "totalsObj": [],
            "showToaster":false,
            "messageType":"",
            "messageTitle":"",
            "messageContent":""
        };

        this.homeHandleClick = this.homeHandleClick.bind(this);
        this.getPreviousRecord = this.getPreviousRecord.bind(this);
        this.getNextRecord = this.getNextRecord.bind(this);
        
        
        //console.log(" Listing Page, Props are:", this.props);
    }
    onLightGallery = node => {
        this.lightGallery = node;
        $(node).lightGallery();
    }
    homeHandleClick(e){
        e.preventDefault();

        this.props.history.push('/landing');
    }

    getPreviousRecord(){
        var self = this;
        self.setState({"loading": true,"showToaster":false,"messageType":"FAIL","messageTitle":"No Records","messageContent":""})
        var pageStsName = MlcConfigurations.getRecordStatusName(this.state.pageName);
        var stsObj = {"userId":this.props.userId,"reqStatus":pageStsName,"regRecId":this.state.regData.id,"currRecCreatedAt":this.state.regData.created_at,"recordType":"PREV"};
        //console.log("Sts Update Obj-Prev:",stsObj);
        axios.post('/api/getRegistrationDetailsCustom',stsObj)
            .then(res =>{
                //console.log("PREV RESP:",res);
                self.setState({"loading": false});
                if(res && res.data && res.data.status){
                    if(res.data.status === "FAIL"){
                        // Display error message
                        self.setState({"showToaster":true,"messageType":"INFO","messageTitle":"Info","messageContent":res.data.message});
                        //alert(res.data.message);
                        setTimeout(function(){
                            self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                        },3000);

                    }
                    else if(res.data.regDetails){
                        self.setState({regData: res.data.regDetails});
                    }

                }
            });
    }
    getNextRecord(){
        var self = this;
        self.setState({"loading": true,"showToaster":false,"messageType":"FAIL","messageTitle":"No Records","messageContent":""})
        var pageStsName = MlcConfigurations.getRecordStatusName(this.state.pageName);

        var stsObj = {"userId":this.props.userId,"reqStatus":pageStsName,"regRecId":this.state.regData.id,"currRecCreatedAt":this.state.regData.created_at,"recordType":"NEXT"};
        //console.log("Sts Update Obj- Next:",stsObj);
        axios.post('/api/getRegistrationDetailsCustom',stsObj)
            .then(res =>{
                //console.log("NEXT RESP:",res);
                self.setState({"loading": false});
                if(res && res.data && res.data.status){
                    if(res.data.status === "FAIL"){
                        self.setState({"showToaster":true,"messageType":"INFO","messageTitle":"Info","messageContent":res.data.message});
                      //  alert(res.data.message);
                        setTimeout(function(){
                            self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                        },3000);

                    }
                    else if(res.data.regDetails){
                        self.setState({regData: res.data.regDetails});
                    }
                }
            });
    }
    componentWillUnmount() {
        $(this.lightGallery).data('lightGallery').destroy(true);
    }
    componentDidMount(){
        var stsSett = MlcConfigurations.getStatusSettings(this.state.pageName);
        //console.log("Settings are:",stsSett);
        this.setState({"actionButtonsSettings": stsSett});

        var self = this;
        self.setState({"loading": true,"showToaster":false,"messageType":"","messageTitle":"","messageContent":""})
        var pageStsName = MlcConfigurations.getRecordStatusName(this.state.pageName);
        //console.log("Page Sts:"+pageStsName);
        var newObj = {"userId":self.props.userId,"reqStatus":pageStsName,"recordType":"FIRST"};
        axios.post('/api/getRegistrationDetailsCustom',newObj)
            .then(res =>{
                //console.log("RESP:",res);

                self.setState({"loading": false})
                if(res && res.data && res.data.status){
                    if(res.data.status === "FAIL"){
                        self.setState({"showToaster":true,"messageType":"FAIL","messageTitle":"Error","messageContent":res.data.message});
                       // alert(res.data.message);
                        setTimeout(function(){
                            self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                        },3000);

                    }

                    else if(res.data.regDetails && res.data.amountTotalsObj){
                        self.setState({regData: res.data.regDetails,totalsObj: res.data.amountTotalsObj});
                    }
                }

            });
    }

    render() {
        let userInfo = this.state.regData || {};
        //console.log("Record is:",userInfo);
        const loader = this.state.loading
        const currPageName = this.state.pageName;
        let actionButtonsSettings = this.state.actionButtonsSettings;

        let pageHeader = {};

        let totalAmount = this.state.totalsObj || [];
        var totalAmountData = '';
        totalAmount.map(function (value,index) {
            totalAmountData += value.sumvalue + " / " +value.currency_type;
            if (index !== (totalAmount.length - 1)) {
                totalAmountData += " ";
            } else {

            }

        });


        if(currPageName === "QUEUE-LIST"){
            //pageHeader = (<p className="page-heading"> Queue</p>);
            pageHeader = (<p className="page-heading"> Queue<div className="total-count"><span className="total-amount">Total : </span><span>{totalAmountData}</span></div></p>);
        }
        else if(currPageName === "WHITE-LIST"){
           // pageHeader = (<p className="page-heading"> Whitelist </p>);
            pageHeader = (<p className="page-heading"> Whitelist<div className="total-count"><span className="total-amount">Total : </span><span>{totalAmountData}</span></div></p>);
        }
        else if(currPageName === "BLACK-LIST"){
            //pageHeader= (<p className="page-heading">Blacklist </p>);
            pageHeader = (<p className="page-heading"> Blacklist<div className="total-count"><span className="total-amount">Total : </span><span>{totalAmountData}</span></div></p>);
        }
        else if(currPageName === "HOLD-LIST"){
            //pageHeader = (<p className="page-heading">Hold </p>);
            pageHeader = (<p className="page-heading"> Hold<div className="total-count"><span className="total-amount">Total : </span><span>{totalAmountData}</span></div></p>);
        }

        let KYCDocsLinks = [];

        return (
            <div className="cmn-container">
                {loader === true ? (<Loading/>) : ''}
                { this.state.showToaster === true? <MlcToaster messageType= {this.state.messageType} messageTitle={this.state.messageTitle} messageContent={this.state.messageContent}/> : ''}
                <div className="item left-sec">
                    

                    <div className="content-holder">

                        {pageHeader}

                        <div className="form-holder">
                              <DetailsComponent formData = {userInfo}/>
                        </div>
                    </div>

                    <div className="action-swiper">

                        <ul className="custom-btns">
                            {actionButtonsSettings.HOME ? (<li><button type="submit" onClick={this.homeHandleClick}> Home </button> </li>):''}

                            {actionButtonsSettings.WHITE ?  <li><button  type="submit" className="cmn-btn " onClick={this.updateStatusTo} btn-status="WHITE">Whitelist</button> </li>: ""}

                            {actionButtonsSettings.BLACK ? <li><button  type="submit" className="cmn-btn " onClick={this.updateStatusTo} btn-status="BLACK">Blacklist</button> </li>:''}

                            {actionButtonsSettings.HOLD ? <li><button  type="submit" className="cmn-btn " onClick={this.updateStatusTo} btn-status="HOLD">Hold</button> </li> : ''}

                            {actionButtonsSettings.ADDNL_INFO ? <li><button  type="submit" className="cmn-btn" data-toggle="modal" data-target="#exampleModal">Additional Info</button> </li> : ''}


                            <li className="custom-li">
                                {actionButtonsSettings.PREV ? <button type="submit" className="cmn-btn circle-btn" onClick={this.getPreviousRecord}> <span className="fa fa-angle-double-left"></span> </button>: ''}

                                {actionButtonsSettings.NEXT? <button type="submit" className="cmn-btn circle-btn" onClick={this.getNextRecord}> <span className="fa fa-angle-double-right"></span> </button>: ''}
                            </li>
                        </ul>

                    </div>
                </div>
                <div className="item right-sec" style={{display:'none'}}>
                    <div className="docs-holder">
                        <p className="page-heading">KYC Documents</p>
                        <div className="docs-sec">


                            <div id="lightgallery" className="custom-gallery" ref={this.onLightGallery}>
                                {KYCDocsLinks}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        );
    }
};

const mapStateToProps = (state)=>{
    let store = {};
    //console.log("Listing Page State is:",state);
    if(state && state.LoginReducer){
        store.userId = state.LoginReducer.userId;
    }

    return store;
};

function mapDispatchToProps(dispatch) {
    return {
//        loginActions: bindActionCreators(loginActions, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ListingPage);