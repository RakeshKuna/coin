import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default class addCity extends Component {
    constructor(props) {
        super(props);
        this.onSave = this.onSave.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.state = {
            countryId: '',
            countriesList: []
        }


    };

    componentDidMount() {
        var self = this;
        axios.get("/api/countriesList")
            .then((response) => {
                self.setState({ "countriesList": response.data.countriesList });
            });
    }
    onCountryChange(e) {
        if (e && e.value) {
            this.setState({ "countryId": e.value });
        }
        else {
            this.setState({ "countryId": "" });
        }
    }


    onSave(e) {
        e.preventDefault();
        let newcity = {
            cityName: this.refs.cityName.value,
            countryId: this.state.countryId
        };

        axios.post("/api/saveNewCity", newcity).then((result) => {
            alert("Message : " + result.data.message);

        }
        )
    }

    render() {
        let countriesList = this.state.countriesList;
        let ctl = [];

        if (countriesList && countriesList.length > 0) {
            for (var k = 0; k < countriesList.length; k++) {
                ctl.push({ "value": countriesList[k]._id, "label": countriesList[k].displayName });
            }
        }
        return (
            <div className="container">
                <div className="page-title"><span><b>Add City</b></span></div>
                <div>
                    <div className="add-city">
                        <label>City Name : </label>
                        <input type="text" placeholder="Enter City" ref="cityName" />
                    </div>
                </div>
                <div>
                    <div className="form-group">
                        <label>Select Country : </label>
                        <Select id="country" name="country" options={ctl} value={this.state.countryId}
                            onChange={this.onCountryChange} placeholder='Choose Country' />
                    </div>
                </div>
                <div className="btns-holder">
                    <button type="submit" className="cmn-btn " onClick={this.onSave}>Save</button>
                </div>
            </div>
        )
    }
}
