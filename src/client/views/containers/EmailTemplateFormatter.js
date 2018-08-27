import React, { Component } from 'react';
import TextEditor from './MlTextEditor';
import axios from 'axios';
import Select from 'react-select';
import {connect} from "react-redux";
import MlcToaster from './mlcToatser';

 class EmailTemplateFormatter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateName : '',
            fromID : '',
            subject :'',
            bodyContent : '',
            templateList : [],
            selectedTemplateId : '',
            templateInfo : {
               bodyContent : ''
            },
            "showToaster":false,
            "messageType":"",
            "messageTitle":"",
            "messageContent":""

        }
        this.saveEmailTemplate = this.saveEmailTemplate.bind(this);
        this.saveAndSendEmailTemplate = this.saveAndSendEmailTemplate.bind(this);
        this.selectEmailTemplate = this.selectEmailTemplate.bind(this);
        this.updateDetails = this.updateDetails.bind(this);
        // this.onbodyContentChange = this.onbodyContentChange.bind(this);
        this.contentHandler = this.contentHandler.bind(this);
        this.getEmailTemplatesList = this.getEmailTemplatesList.bind(this);
    }

    componentDidMount(){
        this.getEmailTemplatesList();
    }


    getEmailTemplatesList(){
        var self = this
        axios.get('/api/getEmailTemplatesList')
            .then((resp) => {
                //console.log("List Details:",resp)
                self.setState({"templateList" : resp.data.templateData})

            })
    }
     //
     // onbodyContentChange(evt){
     //     var newbodyContent = evt.editor.getData();
     //     console.log("onChange fired with event info: ",evt, "and data: ",evt.editor.getData());
     //     let templateInfo = this.state.templateInfo;
     //     templateInfo.bodyContent = newbodyContent;
     //     this.setState({
     //         templateInfo: templateInfo
     //     });
     //     this.setState({
     //         bodyContent: templateInfo
     //     });
     // }

     contentHandler(data){
        // console.log("Data received:",data);
        this.setState({
            bodyContent : data
        });
     }

    selectEmailTemplate(template){
        var self = this;
        if(template && template.value){
            self.setState({"selectedTemplateId" : template.value});

            axios.post('/api/getEmailTemplateData',{"tempId" :template.value})
                .then((res) =>{
                    //console.log("Template Response:",res);
                    self.setState({"templateInfo" : res.data.templateData});
                    self.setState({"bodyContent" : res.data.templateData.bodyContent});
                    self.updateDetails();
                });
        }
        else{
            // console.log("Template value:");
            self.setState({"templateInfo" : {}});
            self.setState({"bodyContent" : ''});
            self.setState({"selectedTemplateId" : ''});
            $(".clear-data").val("");
            // console.log("Template Value Details:",this.state.templateInfo);
        }

    }

    saveEmailTemplate(e){
        e.preventDefault();
        var self = this;
        var emailFormatDet = {
            templateName: this.refs.templateName.value,
            fromID : this.refs.fromID.value,
            subject : this.refs.subject.value,
            bodyContent : this.state.bodyContent,
            tempId : this.state.selectedTemplateId,
            userId : this.props.userId,
            templateFor : this.refs.templateFor.value
        };

        if(!this.refs.templateFor.value || this.refs.templateFor.value === "SELECT"){
            self.setState({"showToaster":true,"messageType":"INFO","messageTitle":"Info","messageContent":"Please select type "});
            //alert("Please select type.");
            setTimeout(function(){
                self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
            },3000);



        }

        else{
            axios.post('/api/saveEmailTemplate',emailFormatDet)
                .then((response) =>{
                    //console.log("Template Details: ",response)

                    if(response && response.data && response.data.status == "SUCCESS"){
                        self.setState({"showToaster":true,"messageType":"SUCCESS","messageTitle":"SUCCESS","messageContent":response.data.message});
                        //alert(response.data.message)
                        setTimeout(function(){
                            self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                        },3000);

                    }
                    else if(response && response.data && response.data.status == "FAIL"){
                        self.setState({"showToaster":true,"messageType":"FAIL","messageTitle":"FAIL","messageContent":response.data.message});
                       // alert("Message: "+response.data.message)
                        setTimeout(function(){
                            self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                        },3000);

                    }

                    self.getEmailTemplatesList();
                    $(".clear-data").val("");
                    self.setState({"templateInfo" : {"bodyContent":" "}});
                    self.setState({"selectedTemplateId" : ''});
                    self.setState({"bodyContent" : ' '});
                });
        }

    }


    saveAndSendEmailTemplate(e){
        e.preventDefault();
        var self = this;
        var emailFormatDetails = {
            templateName: this.refs.templateName.value,
            fromID : this.refs.fromID.value,
            subject : this.refs.subject.value,
            bodyContent : this.state.bodyContent,
            tempId : this.state.selectedTemplateId,
            userId : this.props.userId,
            templateFor : this.refs.templateFor.value

        };

        if(!this.refs.templateFor.value || this.refs.templateFor.value === "SELECT"){
            self.setState({"showToaster":true,"messageType":"INFO","messageTitle":"Info","messageContent":"Please select type "});
            //alert("Please select type.");
            setTimeout(function(){
                self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
            },3000);
        }

        else {
            axios.post('/api/saveAndSendEmailTemplate', emailFormatDetails)
                .then((result) => {
                    // console.log("Send Email Response:",result)
                    if (result && result.data && result.data.status == "SUCCESS") {
                        self.setState({"showToaster":true,"messageType":"SUCCESS","messageTitle":"SUCCESS","messageContent":result.data.message});
                        //alert(result.data.message)
                        setTimeout(function(){
                            self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                        },3000);

                    }
                    else if (result && result.data && result.data.status == "FAIL") {
                        self.setState({"showToaster":true,"messageType":"FAIL","messageTitle":"FAIL","messageContent":result.data.message});
                       // alert("Message: " + result.data.message);
                        setTimeout(function(){
                            self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                        },3000);

                    }

                    self.getEmailTemplatesList();
                    $(".clear-data").val("");
                    self.setState({"templateInfo": {"bodyContent": " "}});
                    self.setState({"selectedTemplateId": ''});
                    self.setState({"bodyContent": ' '});
                })
        }
    }

    updateDetails(){
        $('[name="templateName"]').val(this.state.templateInfo.templateName);
        $('[name="fromID"]').val(this.state.templateInfo.fromID);
        $('[name="subject"]').val(this.state.templateInfo.subject);
        //$('[name="bodyContent"]').val(this.state.templateInfo.bodyContent);
        $('[name="templateFor"]').val(this.state.templateInfo.templateFor);
    }

    render() {
        let emailTemplateList = this.state.templateList
        let etl = [];
        if(emailTemplateList && emailTemplateList.length > 0){
            for(var t =0; t < emailTemplateList.length; t++){
                etl.push ({"value": emailTemplateList[t].tempId,"label":emailTemplateList[t].templateName});
            }
        }

        return (
            <div className="cmn-container">
                { this.state.showToaster === true? <MlcToaster messageType= {this.state.messageType} messageTitle={this.state.messageTitle} messageContent={this.state.messageContent}/> : ''}
                <div className="item left-sec">
                    <div className="whitelist-email-formatter-main">
                        <div className="head-section">
                            <h2 className="header">Email Formatter</h2>
                            <div className="form-group custom-sel-holder">
                                <Select name="Email Template"
                                        placeholder='Select Email Template'
                                        value ={this.state.selectedTemplateId}
                                        onChange ={this.selectEmailTemplate}
                                        options={etl} />
                            </div>

                            <div className="form-group custom-sel-holder">
                                <select name="templateFor" ref="templateFor" className="form-control clear-data">
                                    <option value=""> -- Select Type here --</option>
                                    <option value="QUEUE">Queue</option>
                                    <option value="WHITE">Whitelisted</option>
                                    <option value="HOLD">Hold</option>
                                    <option value="BLACK">Black</option>
                                    <option value="NONE">None</option>
                                </select>
                            </div>

                        </div>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="control-label col-sm-2" htmlFor="email name">Template Name:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control clear-data" ref = "templateName"
                                           placeholder="Template Name" name = "templateName" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-sm-2" htmlFor="from">From:</label>
                                <div className="col-sm-10">
                                    <input type="email" className="form-control clear-data" ref = "fromID"
                                           placeholder="From" name="fromID" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-sm-2" htmlFor="from">Subject:</label>
                                <div className="col-sm-10 subject">
                                    <input type="text" className="form-control clear-data" ref = "subject"
                                           placeholder="Subject" name="subject" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-sm-2" htmlFor="body">Body:</label>
                                <div className="col-sm-10">
                                    <TextEditor content = {this.state.templateInfo && this.state.templateInfo.bodyContent} contentHandler ={this.contentHandler} activeClass="p10"/>

                                    {/*<textarea rows="9" cols="50" className="form-control clear-data"*/}
                                              {/*ref="bodyContent" placeholder="Body" name="bodyContent">*/}
                                    {/*</textarea>*/}

                                </div>
                            </div>
                            <div className="action-swiper custom-position">
                                <ul className="custom-btns">
                                    <li className=""> <button type="submit" onClick={this.saveEmailTemplate}> Save Email Template </button> </li>
                                    <li className=""> <button type="submit" onClick={this.saveAndSendEmailTemplate}> Save and Send Email </button> </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state)=>{
    let store = {};
    //console.log("Listing Page State is:",state);
    if(state && state.LoginReducer){
        store.userId = state.LoginReducer.userId;
    }

    return store;
};

export default connect(mapStateToProps)(EmailTemplateFormatter);
