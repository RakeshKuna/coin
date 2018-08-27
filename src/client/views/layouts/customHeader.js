import React, { Component } from 'react';

export default class customHeader extends Component {
    constructor(props) {
      super(props);
    
    }
  
    componentDidMount() {
    
    }
  
    render() {
      return (
        <div className="reg-header">
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

        <div className="hdr-item logo-block">
          <a href="/"> <span><img src="/public/images/logo.png" /> </span></a>
        </div>
        <div className="hdr-item right">
            <p className="powered-by">Powered by : <span><img src="/public/images/kyc3_logo.png" /></span></p>
          <nav className="navbar navbar-inverse">
            <div className="container-fluid">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>

              </div>
              <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav">
                  <li className="active"><a href="/">Home</a></li>
                  <li><a href="https://www.moolyacoin.io/contact/">Contact</a></li>
                  <li><a href="https://www.moolyacoin.io/whitepaper/">Whitepaper</a></li>
                  <li><a href="#" data-toggle="modal" data-target="#myModal">Help</a></li>
                </ul>

              </div>
            </div>
          </nav>
          {/* <div className="joinlist-hodler">
            <p> Please email us at <span className="emai-txt">‘backers@moolyacoin.io’</span> if you face any issue with this whitelisting form. We will strive to respond back as soon as possible.</p>
          </div> */}
        </div>
      </div>
      );
    }
  }
  