import React, { Component } from 'react';

export default class SecondaryRegistrationThankyouPage extends Component {
    constructor() {
        super();
    };

    componentDidMount() {

    }

    render() {
        return (
            <div className="reg-thanks-section">

                <div className="thanks-sec">
                    <p className="thanks-txt">Thank you for your interest  in moolyacoin. </p>
                    <h4>You can now transfer ETH to the following address:</h4>
                    <h4 style={{color:'#faae43'}}> <b>0x275006409814ef8468396d08c37a74b3c84c3ebd</b></h4>

                    <h4>If you want to transfer USD/EUR, mail us at 'backers@moolyacoin.io'.</h4>
                    <h5>You can click <a href="https://register.moolyacoin.io" target="_blank">here</a> to complete your KYC.</h5>

                   </div>
            </div>
        );
    }
}