import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class customFooter extends Component {
    constructor(props) {
      super(props);
      this.state = {canRedirectToLogin : false};
        this.onLoginClick = this.onLoginClick.bind(this);
    }

    componentDidMount() {
    
    }
    onLoginClick(e){
        e.stopPropagation();
        this.setState({canRedirectToLogin: true});
        //this.props.history.push('/login');

    }
    render() {
        if(this.state.canRedirectToLogin){
            return <Redirect to='/login' />
        }

      return (
        <div className="reg-footer">
        <div className="footer-item left">
            <p>Copyright 2018-19 : All Rights Reserved © moolyacoin.io & www.moolya.global</p>
        </div>
        <div className="footer-item middle">
            <p onClick={this.onLoginClick}><a href="#" >Login</a></p>
            <ul className="footer-ul">
                {/*<li> <a href="/">Home</a> </li>*/}

                <li> <a href="https://www.moolyacoin.io/terms_and_conditions/" target="_blank">Terms of coin sale</a> </li>
                {/*<a href="https://s3.raksan.in/moolyacoin/Terms_of_usage_of_website_moolyacoin_ver1.2.pdf"></a>*/}

                <li> <a href="https://www.moolyacoin.io/privacy-policy/" target="_blank">Privacy Policy</a> </li>
                {/*<a href="https://s3.raksan.in/moolyacoin/moolyacoin_privacy_and_cookie_policy_ver1.2.pdf" target="_blank">*/}

                <li> <a href="https://www.moolyacoin.io/moolyacoin-kyc-aml-policy/" target="_blank">KYC/AML policy</a> </li>
            </ul>
        </div>
        <div className="footer-item right">


            <ul className="social-links">
                <li><a href="https://plus.google.com/112807379365108933424" target="_blank"><span className="fab fa-google-plus" aria-hidden="true"> </span></a>
                </li>
                <li><a href="https://www.facebook.com/Moolyacoin-767830043419216/" target="_blank"><span className="fab fa-facebook-square" aria-hidden="true"> </span></a>
                </li>
                <li><a href="https://twitter.com/moolyacoin" target="_blank"><span className="fab fa-twitter" aria-hidden="true"> </span></a></li>
                <li><a href="https://www.linkedin.com/company/moolyacoin" target="_blank"><span className="fab fa-linkedin" aria-hidden="true"> </span></a></li>
                <li><a href="http://t.me/moolyacoin" target="_blank"><span className="fab fa-telegram" aria-hidden="true"></span></a></li>
                <li><a href="https://medium.com/@moolyacoin" target="_blank"><span className="fab fa-medium" aria-hidden="true"></span></a></li>
            </ul>
        </div>
    </div>
      );
    }
  }
  