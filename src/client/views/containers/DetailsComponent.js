import React, { Component } from 'react';
import moment from "moment/moment";

export default class DetailsComponent extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let userInfo = this.props.formData;
        let dateofbirth = moment(userInfo.date_of_birth).format('DD/MM/YYYY')
        return(
            <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Name</p>
                    <p className="form-val">{userInfo.first_name} {userInfo.last_name} </p>
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Unique ID</p>
                    <p className="form-val">{userInfo.id}</p>
                </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Gender</p>
                    <p className="form-val">{userInfo.gender}</p>
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Contact No</p>
                    <p className="form-val">{userInfo.contactNumber}</p>
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Country</p>
                    <p className="form-val">{userInfo.countryName}</p>
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">City</p>
                    <p className="form-val">{userInfo.cityName}</p>
                </div>
            </div> */}
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Address</p>
                    <p className="form-val">{userInfo.address}</p>
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Public Address</p>
                    <p className="form-val">{userInfo.wallet_address}</p>
                </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Citizenship</p>
                    <p className="form-val">{userInfo.citizenshipName}</p>
                </div>
            </div> */}
            <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                    <p className="form-lbl">Email</p>
                    <p className="form-val">{userInfo.email}</p>
                </div>
            </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                        <p className="form-lbl">Date Of Birth</p>
                        <p className="form-val">{dateofbirth}</p>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                        <p className="form-lbl">Sources of Funds</p>
                        <p className="form-val">{userInfo.source_of_funds}</p>
                    </div>
                </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="form-group">
                    <p className="form-lbl">Comments</p>
                    <p className="form-val">
                            {userInfo.comment}
                    </p>
                </div>
            </div>
        </div>)
    }


}