import React, { Component } from 'react';


export default class register extends Component {
    constructor() {
        super();
    };

    componentDidMount() {

    }

    render() {
        return (

            <div className="reg-thanks-section">
                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                {/* <h4 className="modal-title">Modal Header</h4> */}
                            </div>
                            <div className="modal-body">
                                <p> Please email us at <span className="emai-txt">‘backers@moolyacoin.io’</span> if you face any issue with this whitelisting form. We will strive to respond back as soon as possible.</p>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="thanks-sec">
                    <p className="thanks-txt">Thank you for submitting you registration request.</p>

                    <p className="thanks-txt"> Please note that only the whitelisted backers will be allowed to participate in our ICO.</p>
                    <p> You will now be able to participate in our ICO.</p>
                    <p className="email">You will receive an email to your registered email id with further updates.</p>
                    <p>Please note that you will have to complete the KYC within 30 days, at the same link: </p>
                    <a href="https://whitelist.moolyacoin.io"> https://whitelist.moolyacoin.io</a>
                    <p className="share">Please share this unique ICO participation opportunity with your friends and colleagues.</p>
                    <p>Please mark: 'backers@moolyacoin.io' as 'Not Spam' in your mailbox.</p>
                    <ul className="social-links">
                        <li><a href="http://t.me/moolyacoin" target="_blank"><span className="fab fa-telegram-plane"></span></a></li>
                        <li><a href="https://www.facebook.com/Moolyacoin-767830043419216/" target="_blank"><span className="fab fa-facebook-f"></span></a></li>
                        <li><a href="https://plus.google.com/112807379365108933424" target="_blank"><span className="fab fa-google-plus"></span></a></li>
                        <li><a href="https://twitter.com/moolyacoin" target="_blank"><span className="fab fa-twitter"></span></a></li>
                        <li><a href="https://www.linkedin.com/company/moolyacoin" target="_blank" target="_blank"><span className="fab fa-linkedin"></span></a></li>
                        <li><a href="https://medium.com/@moolyacoin" target="_blank"><span className="fab fa-medium"></span></a></li>
                    </ul>
                    <div className="social-action">Click <a href="www.moolyacoin.io">here</a> to go to our <div className="link"><a href="www.moolyacoin.io">'moolyacoin.io'</a>  </div> website</div>
                </div>

            </div>


        );
    }
}
