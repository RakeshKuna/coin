import React, {Component} from 'react';
import axios from 'axios';
import {connect} from "react-redux";
import MlcToaster from './mlcToatser';

class landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "statusCounts": {},
            "showToaster":false,
            "messageType":"",
            "messageTitle":"",
            "messageContent":""

        };

        this.queueHandleClick = this.queueHandleClick.bind(this);
        this.whiteHandleClick = this.whiteHandleClick.bind(this);
        this.blackHandleClick = this.blackHandleClick.bind(this);
        this.holdHandleClick = this.holdHandleClick.bind(this);
        //this.infoHandleClick = this.infoHandleClick.bind(this);
        this.emailFormatterClick = this.emailFormatterClick.bind(this);
        this.mathEthClick = this.mathEthClick.bind(this);
        this.recordCount=this.recordCount.bind(this);

        this.transferClick=this.transferClick.bind(this);
        this.transferDetailsClick=this.transferDetailsClick.bind(this);

         //console.log("Props are:",this.props);
    };

    queueHandleClick(e) {
        e.preventDefault();
        if(this.recordCount("QUEUE")) {
            this.props.history.push('listingPage/QUEUE-LIST');
        }

    };

    whiteHandleClick(e) {
        e.preventDefault();

        if(this.recordCount("WHITE")) {
            this.props.history.push('listingPage/WHITE-LIST');
        }
    };

    blackHandleClick(e) {
        e.preventDefault();

        if(this.recordCount("BLACK")) {
            this.props.history.push('listingPage/BLACK-LIST');
        }

    };

    holdHandleClick(e) {
        e.preventDefault();

        if(this.recordCount("HOLD")) {
            this.props.history.push('listingPage/HOLD-LIST');
        }

    };

    // infoHandleClick(e) {
    //     e.preventDefault();
    //     this.props.history.push('listingPage/ADDITIONAL-LIST');
    // };

    emailFormatterClick(e){
        e.preventDefault();
        this.props.history.push('/emailTemplateFormatter');
    };

    mathEthClick(e){
        e.preventDefault();
        this.props.history.push('/transactionDetails');
    };
    transferClick(e){
        e.preventDefault();
        this.props.history.push('/transfer');
    };
    transferDetailsClick(e){
        e.preventDefault();
        this.props.history.push('/transferDetails');
    };
     recordCount(stsCode){
         var counts = this.state.statusCounts;
         if(counts && counts[stsCode] > 0) {
             return true;
         }
         else{
             this.setState({"showToaster":true,"messageType":"INFO","messageTitle":"Info","messageContent":"No Records to display"})
             //alert("No Records to Display");
             setTimeout(function(){
                 this.setState({"showToaster":false,"messageType":"","messageTitle":"","messageContent":""});
             },3000);
             return false;
         }

     }

    componentDidMount() {
        var self = this;
        axios.get('/api/statusesCounts')
            .then(res => {
                //console.log("RESP:", res);
                if (res && res.data && res.data.status) {
                    if (res.data.status === "SUCCESS") {
                        self.setState({"statusCounts": res.data.countsData});
                    }
                    else if (res.data.status === "FAIL") {
                        alert(res.data.message);
                    }
                }
            });
    }

    render() {
        var stsCts = this.state.statusCounts;
        var countsObj = {"QUEUE": 0,"WHITE": 0,"BLACK": 0,"HOLD": 0,"ADDL_INFO": 0, "TOTAL": 0};
        var total = 0

        if(stsCts && stsCts.QUEUE){
            countsObj["QUEUE"] = stsCts.QUEUE;
            total = parseInt(total) + parseInt(stsCts.QUEUE);
        }
        if(stsCts && stsCts.WHITE){
            countsObj["WHITE"] = stsCts.WHITE;
            total = parseInt(total) + parseInt(stsCts.WHITE);
        }
        if(stsCts && stsCts.BLACK){
            countsObj["BLACK"] = stsCts.BLACK;
            total = parseInt(total) + parseInt(stsCts.BLACK);
        }
        if(stsCts && stsCts.HOLD){
            countsObj["HOLD"] = stsCts.HOLD;
            total = parseInt(total) + parseInt(stsCts.HOLD);
        }
        // if(stsCts && stsCts.ADDL_INFO){
        //     countsObj["ADDL_INFO"] = stsCts.ADDL_INFO;
        // }
            countsObj["TOTAL"] = total;


        return (
            <div className="sec-holder">
                { this.state.showToaster === true? <MlcToaster messageType= {this.state.messageType} messageTitle={this.state.messageTitle} messageContent={this.state.messageContent}/> : ''}
                <ul>
                    <li>
                        <div className="item left">
                            <button type="submit" onClick={this.queueHandleClick} className="style-1"> Queue</button>
                        </div>
                        <div className="item right"><p> {countsObj.QUEUE}</p></div>
                    </li>
                    <li>
                        <div className="item left">
                            <button type="submit" onClick={this.whiteHandleClick} className="style-1"> Whitelist
                            </button>
                        </div>
                        <div className="item right"><p> {countsObj.WHITE}</p></div>
                    </li>
                    <li>
                        <div className="item left">
                            <button type="submit" onClick={this.blackHandleClick} className="style-1"> Blacklist
                            </button>
                        </div>
                        <div className="item right"><p> {countsObj.BLACK}</p></div>
                    </li>
                    <li>
                        <div className="item left">
                            <button type="submit" onClick={this.holdHandleClick} className="style-1"> Hold</button>
                        </div>
                        <div className="item right"><p> {countsObj.HOLD}</p></div>
                    </li>
                    {/*<li>*/}
                        {/*<div className="item left">*/}
                            {/*<button type="submit" onClick={this.infoHandleClick} className="style-1"> Additional Info*/}
                            {/*</button>*/}
                        {/*</div>*/}
                        {/*<div className="item right"><p> {countsObj.ADDL_INFO}</p></div>*/}
                    {/*</li>*/}
                    <li>
                        <div className="item left">
                            <button type="submit" className="total"> Total</button>
                        </div>
                        <div className="item right"><p className="total"> {countsObj.TOTAL}</p></div>
                    </li>
                </ul>
                <div className="buttons" style={{display:'block'}}>
                    <ul>
                        <li>
                            <div className="item left"> <button type="submit" onClick={this.emailFormatterClick} className="style-1" > Email Formatter</button> </div>
                        </li>
                        <li>
                            <div className="item left"> <button type="submit" onClick={this.mathEthClick} className="style-1" > Match ETH</button> </div>
                        </li>

                        <li>
                            <div className="item left"> <button type="submit" onClick={this.transferClick} className="style-1" > Transfer Tokens</button> </div>
                        </li>

                        <li>
                            <div className="item left"> <button type="submit" onClick={this.transferDetailsClick} className="style-1" >Tokens Status</button> </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    //console.log("LandingPage State:",state);
    var store= {};
    if(state && state.LoginReducer){
        store.username = state.LoginReducer.username;
        store.userId = state.LoginReducer.userId;
    }
    return store;
};

export default connect(mapStateToProps)(landing);