import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import loginActions from '../views/actions/LoginActions';
import Loading from './loader';
import MlcToaster from './containers/mlcToatser';

class Login extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            canRedirect: false,
            loading:false,
            "showToaster":false,
            "messageType":"",
            "messageTitle":"",
            "messageContent":""
        }
    };

    handleClick(e) {
        e.preventDefault();

        var self = this;

        self.setState({"loading": true, "showToaster":false,"messageType":"FAIL","messageTitle":"Login Error","messageContent":""})

        var loginDet = {"username": this.refs.username.value,"password": this.refs.password.value};
        //console.log("Login Dt:",loginDet);

        axios.post('/api/login',loginDet)
          .then(res =>{
            //console.log("RESP:",res);
              self.setState({"loading": false});

              if(res && res.data.status && res.data.status === "SUCCESS"){
                this.props.loginActions.loginData(loginDet.username,res.data.userId,res.data.displayName);
                self.setState({canRedirect:true, showToaster : false});
                //this.props.history.push('/landing');

            }
            else if(res && res.data.status && res.data.status === "FAIL"){
                    // Display error message.

                  self.setState({"showToaster":true,"messageType":"FAIL","messageTitle":"Login Error","messageContent":res.data.message});

                        // TO Clear state values after sometime.
                  setTimeout(function(){
                      self.setState({"showToaster":false,"messageType":"FAIL","messageTitle":"Login Error","messageContent":""});
                  },3000);
              }

          });
    };


    componentDidMount() {    
        $(document).ready(function () {
            //floating labels
            $('.floating-label .form-control').on('focus blur', function (e) {
                $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
            }).trigger('blur');
            $('.floating-label .form-control').focus(function () {
                $(this).data('placeholder', $(this).attr('placeholder'))
                    .attr('placeholder', '');
            }).blur(function () {
                $(this).attr('placeholder', $(this).data('placeholder'));
            });
        });
    }

    render() {
        if (this.state.canRedirect) {
            return <Redirect to='/landing' />
        }
        const loader = this.state.loading

        return (
            <div className="login-container">
                {loader === true ? (<Loading/>) : ''}

                { this.state.showToaster === true? <MlcToaster messageType= {this.state.messageType} messageTitle={this.state.messageTitle} messageContent={this.state.messageContent}/> : ''}

                <div className="login-sec">

                    <div className="login-top">
                        <img src="public/images/moolyacoin.png"/>
                    </div>
                    <div className="login-body">

                        <div className="floating-label">
                            <div className="form-group">
                                <label className="control-label">Username </label>
                                <input type="text" name="email" className="form-control" placeholder="First Name" ref="username"
                                       required/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Password </label>
                                <input type="password" name="password" className="form-control" placeholder="Password" ref="password"
                                       required/>
                            </div>

                        </div>
                        <div className="login">
                            <button className="btn_login" onClick={this.handleClick} name="btn_login"
                                    type="submit">Login
                            </button>

                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state)=>{
    let store = {};
    //console.log("State is:",state);
    if(state && state.LoginReducer){
        store.username = state.LoginReducer.username;
        store.userId = state.LoginReducer.userId;
        store.displayName = state.LoginReducer.displayName;
    }

    return store;
};

function mapDispatchToProps(dispatch) {
    return {
        loginActions: bindActionCreators(loginActions, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);