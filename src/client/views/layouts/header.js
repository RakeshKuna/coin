import React, { Component } from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { Redirect } from 'react-router-dom';
import HeaderActions from '../actions/HeaderActions';
import LoginActions from '../actions/LoginActions';

class header extends Component {
    constructor(props) {
      super(props);
        //console.log("Props are:",this.props);
        this.onLogoutAction = this.onLogoutAction.bind(this);
    }
  
    componentDidMount() {
        // if(!this.props.userDetails){
        //     this.props.headerActions.headerData(this.props.userId);
        // }
    }
    onLogoutAction(){
        //console.log("On Logout..");
        this.props.loginActions.logoutData(this.props.userId);
    }
  
    render() {

        //console.log("In Header Render:",this.props);
        let userDisplayName = this.props.displayName;

        if(!userDisplayName || userDisplayName === ''){
            return <Redirect to='/' />
        }
      return (
        <div className="main-header">
        <div className="item">
            <div className="logo-sec">
                <img src="/public/images/logo.png" />
            </div>
        </div>
        <div className="item">
            <div className="right-sec">
                <ul>
                    <li>
                        <p>Hello, {userDisplayName}

                            <span>
                                <img src="/public/images/user-icon.png" /> </span>
                        </p>
                    </li>
                    <li>
                        <span>
                                <button name="logout" type="submit" onClick={this.onLogoutAction}> Logout</button>
                        </span>
                    </li>
                   
                </ul>
            </div>
        </div>
    </div>
      );
    }
  }

const mapStateToProps = (state)=>{
    //console.log("HeaderPage State:",state);
    var store= {};
    if(state && state.LoginReducer){
        store.username = state.LoginReducer.username;
        store.userId = state.LoginReducer.userId;
        store.displayName = state.LoginReducer.displayName;
    }

    return store;
};

function mapDispatchToProps(dispatch) {
    return {
        loginActions: bindActionCreators(LoginActions, dispatch)
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(header);