import React, {Component} from 'react';
// import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
// import '../../common/stylesheets/css/plugins/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import MlConfigurations from '../../common/mlcConfigurations';
import axios from 'axios';
import Pagination from './paginationComponent';
import Loading from '../loader';
import _ from 'underscore';
import MlcToaster from './mlcToatser';


export default class TransactionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ethDetailsList: [],
            rowsPerPage: 10,
            totalRows: 10,
            pageNumber: 1,
            whiteListCount: '0',
            pendingListCount: '0',
            contributionInfo: [],
            loading: false,
            "showToaster":false,
            "messageType":"",
            "messageTitle":"",
            "messageContent":""

        };

        this.onConfirmEmailAndSend = this.onConfirmEmailAndSend.bind(this);
        this.onRowChange = this.onRowChange.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onPageHandler = this.onPageHandler.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.onCSVDownload = this.onCSVDownload.bind(this);
    }

    componentDidMount() {
        var self = this;
        self.setState({"loading": true})
        setTimeout(function () {
            axios.post('/api/getETHDetails', {"offset": 0, "rowsPerPage": self.state.rowsPerPage})
                .then((response) => {
                    //console.log("DATA:", response);
                    self.setState({"ethDetailsList": response.data.ethDetails, "totalRows": response.data.rowsCount});
                    self.setState({
                        "whiteListCount": response.data.statusCount,
                        "pendingListCount": response.data.pendingListCount,
                        "contributionInfo": response.data.submittedValue
                    });
                    self.setState({"loading": false})
                });
        }, 2000)

    }


    onRowChange(data) {
        this.setState({
            rowsPerPage: data
        })
        this.onPageHandler();
    }

    onPageChange(page) {
        this.setState({
            pageNumber: page
        })
        this.onPageHandler();
    }

    onPageHandler() {
        var self = this;
        self.setState({"loading": true})

        setTimeout(function () {
            var requestedDetails = {
                offset: (self.state.pageNumber - 1) * self.state.rowsPerPage,
                rowsPerPage: self.state.rowsPerPage
            };

            axios.post('/api/getTransactionDetailsForPagination', requestedDetails)
                .then((response) => {
                    //console.log("Pagination Details:", response);
                    self.setState({"ethDetailsList": response.data.ethDetails});
                    self.setState({"loading": false});

                    if (response.data && response.data.ethDetails.length === 0) {
                        self.setState({"pageNumber": 1});
                        self.onPageHandler();
                    }

                });
        }, 1000);

    }

    onConfirmEmailAndSend(e) {
        e.preventDefault();
        var self = this;
        self.setState({"loading": true,"showToaster":false,"messageType":"","messageTitle":"","messageContent":""})
        var currRowId = $(e.currentTarget).attr("data-rowid");
        var compId = "actualValue-" + currRowId;
        var actVal = $("#" + compId).val();

        var transDetails = {
            actualValue: actVal,
            userId: this.props.userId,
            id: currRowId
        };

        axios.post('/api/updateTransactionDetails', transDetails)
            .then((req) => {
                //console.log("DETAILS:", req);
                if (req && req.data && req.data.status == "SUCCESS") {
                    //alert("Message"+req.data.message);

                    var newDt = req.data.updatedTransactionDetails || {"id": ''};
                    var allDt = this.state.ethDetailsList;

                    var currIdIndex = allDt.findIndex(function (rec) {
                        if (rec && rec.id && rec.id === newDt.id) {
                            return rec;
                        }
                    });

                    if (currIdIndex > -1) {
                        var upd = allDt[currIdIndex] || {};
                        upd = _.extend(upd, newDt);
                        allDt[currIdIndex] = upd;
                        self.setState({"ethDetailsList": allDt});
                    }

                    if(req.data.pendingListCount){
                        self.setState({"pendingListCount": req.data.pendingListCount});

                    }

                }
                else if (req && req.data && req.data.status == "FAIL") {
                    self.setState({"loading": false,"showToaster":true,"messageType":"FAIL","messageTitle":"Error","messageContent":req.data.message});
                    //alert("Message" + req.data.message)
                    setTimeout(function(){
                        self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                    },3000);

                }
            });

    }
    exportCSV(){
        var self = this;
        self.setState({"loading": true,"showToaster":false,"messageType":"","messageTitle":"","messageContent":""})
        axios.post('/api/exportCSVTransactionDetails',{})
            .then((response) => {
                //console.log("Export Data:", response);
                self.setState({"loading": false});

                if(response && response.data.status && response.data.status === "FAIL"){
                    self.setState({"loading": false,"showToaster":true,"messageType":"INFO","messageTitle":"Info","messageContent":response.data.message});
                    //alert(response.data.message);
                    setTimeout(function(){
                        self.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
                    },3000);

                }
                else if (response.data && response.data.status && response.data.status === "SUCCESS" && response.data.exportData.length>0) {

                        // Function to trigger download.
                    self.onCSVDownload(response.data.exportData);
                }

            });
    }
    onCSVDownload(data){
        var custData = data;
        custData = custData.join("\r\n");

        this.link.href = 'data:text/csv,'+custData;
        this.link.download = 'TransactionDetails.csv'
        this.link.click();

                // To render same page with updated details.
        this.onPageHandler();
    }

    isExpandableRow(row) {
        if (row) return true;
        else return false;
    }

    expandComponent = (row) => {
        var dateOfTransfer = dateFormatter(row.dateOfTransfer);
        var compId = "actualValue-" + row.id;
        if (row) {
            return (
                <div className="row-expand">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actual Value</th>
                            <th>Submitted Value</th>
                            <th>Public Address</th>
                            <th>Tx hash</th>
                            <th>Date of transfer</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{row.first_name}{row.last_name}</td>
                            <td>{row.export == 'NA' ?
                                <input type="text" className="form-control" id={compId} ref={compId}
                                       placeholder="Actual Value"/> : row.actualValue}</td>
                            <td>{row.submittedValue}</td>
                            <td>{row.publicAddress}</td>
                            <td>{row.txHash}</td>
                            <td>{dateOfTransfer}</td>
                        </tr>
                        </tbody>
                    </table>
                    {row.export == 'NA' ?
                        <div className="control-buttons">
                            <button className="confirm btn btn-success" data-rowid={row.id}
                                    onClick={this.onConfirmEmailAndSend}>Confirm & Send Email
                            </button>
                            <button className="cancel btn btn-danger">Cancel</button>
                        </div>
                        : ''}

                </div>
            );
        } else {
            return (
                <p>No Data</p>
            )
        }
    }


    render() {

        const options = {
            expandRowBgColor: 'rgb(242, 255, 163)',
        };
        const loader = this.state.loading
        var whiteListCount = this.state.whiteListCount
        var pendingListCount = this.state.pendingListCount
        var contributionInfo = this.state.contributionInfo
        var contributionData = '';

        contributionInfo.map(function (info, infIndex) {
            contributionData += info.sumvalue + " " + info.currency_type;

            if (infIndex !== (contributionInfo.length - 1)) {
                contributionData += " +<br>"; // to get next value in next row.
            } else {
                contributionData += "&nbsp;&nbsp;&nbsp;"; // Just for alignment w.r.t. above line content.
            }
        });

        return (
            <div className="cmn-container">
                {loader === true ? (<Loading/>) : ''}
                { this.state.showToaster === true? <MlcToaster messageType= {this.state.messageType} messageTitle={this.state.messageTitle} messageContent={this.state.messageContent}/> : ''}
                <div className="item left-sec">
                    <div className="math-eth">
                        <div className="total-records">
                            <div className="categories">
                                <div className="whitelist">
                                    <h4>Total whitelist</h4>
                                    <span>{whiteListCount}</span>
                                </div>
                                <div className="contributed">
                                    <h4>Contributed</h4>
                                    <span dangerouslySetInnerHTML={{__html: contributionData}}/>
                                </div>
                                <div className="pending">
                                    <h4>Pending Match</h4>
                                    <span>{pendingListCount}</span>
                                </div>
                            </div>
                        </div>
                        <div className="math-eth-table">

                            <BootstrapTable
                                data={this.state.ethDetailsList}
                                striped
                                hover
                                options={options}
                                expandableRow={this.isExpandableRow}
                                expandComponent={this.expandComponent}
                            >
                                <TableHeaderColumn isKey dataField='id' hidden={true} dataSort={true}
                                                   expandable={false}>Id</TableHeaderColumn>
                                <TableHeaderColumn dataField='user_id' dataSort={true} expandable={false}>Unique
                                    Id</TableHeaderColumn>
                                <TableHeaderColumn dataField='publicAddress' expandable={false}>Public
                                    Address</TableHeaderColumn>
                                <TableHeaderColumn dataField='submittedValue' expandable={false}
                                                   dataFormat={currencyFormatter}>Value/Currency
                                    Type</TableHeaderColumn>
                                <TableHeaderColumn dataField='txHash' expandable={false}>Tx Hash</TableHeaderColumn>
                                <TableHeaderColumn dataField='actualValue' expandable={false}>Actual
                                    Value</TableHeaderColumn>
                                {/*<TableHeaderColumn dataField='match' dataFormat={activeFormatter}  width='60'>Details</TableHeaderColumn>*/}
                                <TableHeaderColumn dataField='export' expandable={false}>Exported
                                    Y/N</TableHeaderColumn>
                                <TableHeaderColumn dataField='dateOfTransfer' dataFormat={dateFormatter}
                                                   expandable={false}>Date of transfer</TableHeaderColumn>
                            </BootstrapTable>
                        </div>

                        <Pagination rowsPerPage={this.state.rowsPerPage} currPageNumber={this.state.pageNumber}
                                    onRowsCountChange={this.onRowChange} onPageChange={this.onPageChange}
                                    totalRows={this.state.totalRows}/>

                        <div className="action-swiper custom-position">
                            <ul className="custom-btns">
                                <li className="">
                                    <button type="submit" onClick={this.exportCSV}> Extract CSV</button>
                                </li>

                                {/* CSV Download Component, don't change it to 'show' */}
                                <a ref={link => this.link = link}  style={{display: 'none'}} />

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ActiveFormatter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <input type='checkbox' className="details" defaultChecked={this.props.match}/>
        );
    }
}

function activeFormatter(cell, row, enumObject, index) {
    return (
        <ActiveFormatter match={cell} matchRow={row} rowIndex={index}/>
    );
}

function dateFormatter(cell, row) {
    return MlConfigurations.getFormattedDate(cell)
}


function currencyFormatter(cell, row) {
    return `${row.submittedValue} / ${row.currency_type}`
}