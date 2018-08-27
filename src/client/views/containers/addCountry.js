import React, { Component } from 'react';
import axios from 'axios';

export default class addCountry extends Component {
    constructor(props){
        super(props);
        this.onSave = this.onSave.bind(this);
    }

    onSave(e) {
        e.preventDefault();
        let newcountry = {
            countryName: this.refs.countryName.value,
            countryCode: this.refs.countryCode.value,
            phoneNumberCode:this.refs.phoneNumberCode.value
        };

        axios.post("/api/saveNewCountry", newcountry).then((result) => {
            alert("Message : "+result.data.message);

        }
        )
    }


    render() {
        return (
            <div className="container">
                <div className="page-title"><span><b>Add Country</b></span></div>
                <div>
                    <div className="add-country">
                        <label>Country Name : </label>
                        <input type="text" placeholder="Enter Country" ref="countryName" />
                    </div>
                </div>
                <div>
                    <div className="add-countrycode">
                        <label>Country Code : </label>
                        <input type="text" placeholder="Enter Country" ref="countryCode" />
                    </div>
                </div>
                <div>
                    <div className="add-phcode">
                        <label>Phone Number Code : </label>
                        <input type="text" placeholder="Enter Country" ref="phoneNumberCode" />
                    </div>
                </div>
                <div className="btns-holder">
                    <button type="submit" className="cmn-btn " onClick={this.onSave}>Save</button>
                </div>
                </div>

                )
            }
        
        
}