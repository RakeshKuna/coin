import React, { Component } from 'react';
import $ from 'jquery';
import 'lightgallery';
import 'lg-zoom';
import 'lg-fullscreen';
import 'lg-thumbnail';
// import 'lightgallery';
import axios from 'axios';


export default class Queue extends Component {
    constructor(props) {
        super(props);
        this.state  = {"regData":{}};

        this.homeHandleClick=this.homeHandleClick.bind(this);
        this.updateStatusTo = this.updateStatusTo.bind(this);
        this.getPreviousRecord = this.getPreviousRecord.bind(this);
        this.getNextRecord = this.getNextRecord.bind(this);
      }
      homeHandleClick(e){
          e.preventDefault();
          this.props.history.push('landing');
      };
    onLightGallery = node => {
        this.lightGallery = node;
        $(node).lightGallery();
    }

    componentWillUnmount() {
        $(this.lightGallery).data('lightGallery').destroy(true);
    }
    updateStatusTo(e){
        var self = this;
        var newStatus = $(e.currentTarget).attr("btn-status");
        var stsObj = {"userId":"5b1bb9e317eab725f698a029","newStatus":newStatus,"regRecId":this.state.regData._id};
        console.log("Sts Update Obj:",stsObj);
        axios.post('/api/updateStatus',stsObj)
        .then(res =>{
          console.log("RESP:",res);
            self.getNextRecord();
        });
    }
    getPreviousRecord(){
        var self = this;
        var stsObj = {"userId":"5b1bb9e317eab725f698a029","status":this.state.regData.status,"regRecId":this.state.regData._id};
        console.log("Sts Update Obj-Prev:",stsObj);
        axios.post('/api/getPreviousRecord',stsObj)
            .then(res =>{
                console.log("RESP:",res);
                if(res && res.data && res.data.status){
                    if(res.data.status === "FAIL"){
                        alert(res.data.message);
                    }
                    else if(res.data.regDetails){
                        self.setState({regData: res.data.regDetails});
                    }

                }
            });
    }
    getNextRecord(){
        var self = this;
        var stsObj = {"userId":"5b1bb9e317eab725f698a029","status":this.state.regData.status,"regRecId":this.state.regData._id};
        console.log("Sts Update Obj- Next:",stsObj);
        axios.post('/api/getNextRecord',stsObj)
            .then(res =>{
                console.log("RESP:",res);
                if(res && res.data && res.data.status){
                    if(res.data.status === "FAIL"){
                        alert(res.data.message);
                    }
                    else if(res.data.regDetails){
                        self.setState({regData: res.data.regDetails});
                    }
                }
            });
    }
    componentDidMount() {
        var self = this;
        var newObj = {"userId":"5b1bb9e317eab725f698a029","reqStatus":"QUEUE"};
        axios.post('/api/getRecord',newObj)
        .then(res =>{
          console.log("RESP:",res);
          if(res && res.data && res.data.regDetails){
              self.setState({regData: res.data.regDetails});
          }

        });
    }
  
    render() {
        let userInfo = this.state.regData || {};
        //console.log("Info is:",userInfo);
        //     {fname: 'Combination 1', lname: 'budget', gender: 'Male', contact: 'Male',country: 'Male',city: 'Male',
        //     address:'Nizampet', publicAdd:'',Citizenship:'indian', comments:'loreum'
        //   }
      return (
        <div className="cmn-container">
        <div className="item left-sec">
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header custom-hdr">
                            <p className="page-heading">Additional Info Details</p>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span className="fa fa-times-circle" aria-hidden="true"></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="form-val">
                                <textarea placeholder="Comments here ..." cols="30" rows="4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, ex, recusandae.
                                    Facere modi sunt, quod quibusdamdignissimos neque rem nihil ratione est placeat</textarea>
                            </p>
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <div className="form-check">
                                        <label>
                                            <input type="checkbox" name="check" />
                                            <span className="label-text">Passport</span>
                                        </label>
                                    </div>
                                   
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <div className="form-check">
                                        <label>
                                            <input type="checkbox" name="check" />
                                            <span className="label-text">Voter's Identity Card</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <div className="form-check">
                                        <label>
                                            <input type="checkbox" name="check" />
                                            <span className="label-text">Aenean lobortis</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <div className="form-check">
                                        <label>
                                            <input type="checkbox" name="check" />
                                            <span className="label-text">Driving License</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <div className="form-check">
                                        <label>
                                            <input type="checkbox" name="check" />
                                            <span className="label-text">Unique Identification Number</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <div className="form-check">
                                        <label>
                                            <input type="checkbox" name="check" />
                                            <span className="label-text">Phesellus Consequat</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <div className="form-check">
                                        <label>
                                            <input type="checkbox" name="check" />
                                            <span className="label-text">Others</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ul className="custom-btns">
                                <li><button className="cmn-btn">Cancel</button> </li>
                                <li><button className="cmn-btn style-2">Send</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-holder">
            <p className="page-heading">Queue  <span className="total-count">Total Pending: </span><span>25(200)</span> <span className="time-stamp">06-06-2018 04:25 </span>  </p>
                <div className="form-holder">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">First Name</p>
                                <p className="form-val">{userInfo.firstName} </p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Last Name</p>
                                <p className="form-val">singh</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Gender</p>
                                <p className="form-val">Male</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Contact No</p>
                                <p className="form-val">+91 9701234567</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Country</p>
                                <p className="form-val">India</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">City</p>
                                <p className="form-val">Hyderabad</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Address</p>
                                <p className="form-val">Nizampet X Roads, Kukatpally, Hyderabad</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Public Address</p>
                                <p className="form-val">Nizampet X Roads, Kukatpally, Hyderabad</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Citizenship</p>
                                <p className="form-val">Indian</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">Email</p>
                                <p className="form-val">sanjaysingh@gmail.com</p>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="form-group">
                                <p className="form-lbl">Comments</p>
                                <p className="form-val">
                                    <textarea placeholder="Comments here ..." cols="30" rows="4"></textarea>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="action-swiper">
               
                <ul className="custom-btns">
                <li className=""> <button type="submit" onClick={this.homeHandleClick}> Home </button> </li>
                    <li><button   type="submit" className="cmn-btn " onClick={this.updateStatusTo} btn-status="WHITE">Whitelist</button> </li>
                    <li><button  type="submit" className="cmn-btn " onClick={this.updateStatusTo} btn-status="BLACK">Blacklist</button> </li>
                    <li><button  type="submit" className="cmn-btn " onClick={this.updateStatusTo} btn-status="HOLD">Hold</button> </li>
                    <li><button  type="submit" className="cmn-btn" data-toggle="modal" data-target="#exampleModal">Additional Info</button> </li>
                    <li className="custom-li">
                    <button type="submit" className="cmn-btn circle-btn" onClick={this.getPreviousRecord}> <span className="fa fa-angle-double-left"></span> </button>
                            <button type="submit" className="cmn-btn circle-btn" onClick={this.getNextRecord}> <span className="fa fa-angle-double-right"></span> </button>
                            
                    </li>
                </ul>
     
            </div>
        </div>
        <div className="item right-sec">
            <div className="docs-holder">
                <p className="page-heading">KYC Documents</p>
                <div className="docs-sec">
                <div id="lightgallery" className="custom-gallery" ref={this.onLightGallery}>
                        <a href="../public/images/pan-card.jpg">
                            <img alt="" src='../public/images/pan-card.jpg' />
                        </a>
                        <a href="../public/images/Aadhar-card.jpg">
                            <img alt="thumbnail" src='../public/images/Aadhar-card.jpg' />
                        </a>
                        <a href="../public/images/voter_card.png">
                            <img src="../public/images/voter_card.png" />
                        </a>
                    </div>
                    
                </div>
            </div>

        </div>
    </div>
      );
    }
  }
  