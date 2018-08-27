import React, { Component } from 'react';
import $ from 'jquery';
import 'lightgallery';
import 'lg-zoom';
import 'lg-fullscreen';
import 'lg-thumbnail';
// import 'lightgallery';


export default class blacklist extends Component {
    constructor(props) {
      super(props);
      this.homeHandleClick=this.homeHandleClick.bind(this);
    
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
    componentDidMount() {
   
    }
  
    render() {
        let userInfo = {
            fname: 'Combination 1', lname: 'budget', gender: 'Male', contact: 'Male',country: 'Male',city: 'Male',
            address:'Nizampet', publicAdd:'',Citizenship:'indian', comments:'loreum'
          }
      return (
        <div className="cmn-container">
        <div className="item left-sec">
          
            <div className="content-holder">
            <p className="page-heading">Blacklist </p>
                <div className="form-holder">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="form-group">
                                <p className="form-lbl">First Name</p>
                                <p className="form-val">Sanjay </p>
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

            <div className="action-swiper custom-position">
            <div class="arrow-block">
            <button type="submit" className="cmn-btn circle-btn"> <span className="fa fa-angle-double-left"></span> </button>
                                <button type="submit" className="cmn-btn circle-btn"> <span className="fa fa-angle-double-right"></span> </button>
                        
                    </div>
                <ul className="custom-btns">
                    <li className=""> <button type="submit" onClick={this.homeHandleClick}> Home </button> </li>
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
  