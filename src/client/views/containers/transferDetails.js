import React, {Component} from 'react';
import axios from "axios/index";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import _ from 'underscore';

var moment = require('moment');

import MlcToaster from './mlcToatser';
import Pagination from './paginationComponent';
import Loading from '../loader';
import MlConfigurations from '../../common/mlcConfigurations';


export default class transferDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            trDetails:[],
            rowsPerPage: 10,
            totalRows: 10,
            pageNumber: 1,
            loading: false,
            dataForPage : "FIRST"

        };
        this.onRowChange = this.onRowChange.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onPageHandler = this.onPageHandler.bind(this);

    }
    onRowChange(data) {
        this.setState({
            rowsPerPage: data,
            dataForPage : "NEXT"
        });
        this.onPageHandler();
    }

    onPageChange(page) {
        this.setState({
            pageNumber: page,
            dataForPage :"NEXT"
        });
        this.onPageHandler();
    }

    onPageHandler() {
        var self = this;
        self.setState({"loading": true});

        setTimeout(function () {
            var requestedDetails = {
                offset: (self.state.pageNumber - 1) * self.state.rowsPerPage,
                rowsPerPage: self.state.rowsPerPage,
                dataForPage : self.state.dataForPage
            };

            axios.post('/api/getTransferDetails', requestedDetails)
                .then((response) => {
                    //console.log("Pagination Details:", response);
                    self.setState({"trDetails": response.data.trDetails, "loading": false});


                    if(self.state.dataForPage === "FIRST"){
                        self.setState({"totalRows": response.data.rowsCount});
                    }

                    if (response.data && response.data.trDetails.length === 0) {
                        self.setState({"pageNumber": 1});
                        self.onPageHandler();
                    }

                });
        }, 1000);

    }
    componentWillMount(){
        this.onPageHandler();
    }

    render() {

        const options = {};

        const loader = this.state.loading;
        var contributionData = '';


        return (
            <div className="cmn-container">

                    {loader === true ? (<Loading/>) : ''}

                <div className="item left-sec">
                    <div className="math-eth">

                        <div className="total-records">
                            <h2>Token Assignments</h2>
                        </div>

                        <div classNamxe="math-eth-table">

                            <BootstrapTable
                                data={this.state.trDetails}
                                striped
                                hover
                                options={options}>

                                <TableHeaderColumn isKey dataField='id' hidden={true} expandable={false}>Id</TableHeaderColumn>
                                <TableHeaderColumn dataField='receiver_address' expandable={false}>Receiver</TableHeaderColumn>
                                <TableHeaderColumn dataField='tokens_count' expandable={false}>Tokens Count</TableHeaderColumn>
                                <TableHeaderColumn dataField='status' expandable={false}> Status</TableHeaderColumn>
                                <TableHeaderColumn dataField='txHash' expandable={false}>Tx Hash</TableHeaderColumn>

                                <TableHeaderColumn dataField='created_at' dataFormat={dateFormatter}
                                                   expandable={false} >Date</TableHeaderColumn>

                            </BootstrapTable>
                        </div>

                        <Pagination rowsPerPage={this.state.rowsPerPage} currPageNumber={this.state.pageNumber}
                                    onRowsCountChange={this.onRowChange} onPageChange={this.onPageChange}
                                    totalRows={this.state.totalRows}/>

                        <div className="action-swiper custom-position">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function dateFormatter(cell, row) {
    var currDt = moment(moment(cell,'x').toDate()).toDate();
    return MlConfigurations.getFormattedDate(currDt);
}