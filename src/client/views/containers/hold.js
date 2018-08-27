import React, { Component } from 'react';
import $ from 'jquery';
import 'lightgallery';
import 'lg-zoom';
import 'lg-fullscreen';
import 'lg-thumbnail';
// import 'lightgallery';


export default class hold extends Component {
    constructor(props) {
        super(props);
        this.homeHandleClick = this.homeHandleClick.bind(this);

    }
    homeHandleClick(e) {
        e.preventDefault();
        this.props.history.push('landing');
    };
    onLightGallery = node => {
        this.lightGallery = node;
        $(node).lightGallery();
    }

    componentWillUnmount() {
        $(this.lightGallery).data('lightGallery').destroy(true);
    }
    componentDidMount() {
        function preview_images() {
            var total_file = document.getElementById("images").files.length;
            for (var i = 0; i < total_file; i++) {
                $('#image_preview').append("<div class='flex-col'><img alt='image' class='img-responsive' src='" + URL.createObjectURL(
                        event.target.files[i]) + "'><span class='fa fa-times-circle image_" + i +
                    "'> </span></div>");

                $('.image_' + i).on('click', function () {
                    $(this).parent().remove();
                });
            }
        }
    }

    render() {
        let userInfo = {
            fname: 'Combination 1', lname: 'budget', gender: 'Male', contact: 'Male', country: 'Male', city: 'Male',
            address: 'Nizampet', publicAdd: '', Citizenship: 'indian', comments: 'loreum'
        }
        return (
            <div className="cmn-container">
                <div className="item left-sec">
                    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header custom-hdr">
                                    <p className="page-heading">Additional Info Details</p>

                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span className="fa fa-times-circle" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p className="form-val">
                                        <textarea placeholder="Comments here ..." cols="30" rows="4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, ex, recusandae.
                                    Facere modi sunt, quod quibusdamdignissimos neque rem nihil ratione est placeat</textarea>
                                    </p>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div className="form-check">
                                                <label>
                                                    <input type="checkbox" name="check" />
                                                    <span className="label-text">Passport</span>
                                                </label>
                                            </div>

                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div className="form-check">
                                                <label>
                                                    <input type="checkbox" name="check" />
                                                    <span className="label-text">Voter's Identity Card</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div className="form-check">
                                                <label>
                                                    <input type="checkbox" name="check" />
                                                    <span className="label-text">Aenean lobortis</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div className="form-check">
                                                <label>
                                                    <input type="checkbox" name="check" />
                                                    <span className="label-text">Driving License</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div className="form-check">
                                                <label>
                                                    <input type="checkbox" name="check" />
                                                    <span className="label-text">Unique Identification Number</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div className="form-check">
                                                <label>
                                                    <input type="checkbox" name="check" />
                                                    <span className="label-text">Phesellus Consequat</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div className="form-check">
                                                <label>
                                                    <input type="checkbox" name="check" />
                                                    <span className="label-text">Others</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <ul className="custom-btns">
                                        <li><button type="dubmit" data-dismiss="modal" className="cmn-btn">Cancel</button> </li>
                                        <li><button type="dubmit" className="cmn-btn style-2">Send</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="upload-files" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header custom-hdr">
                                <p className="page-heading">Upload Files</p>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span className="fa fa-times-circle" aria-hidden="true"></span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input type="file" className="form-control upload-file" id="images" name="images[]" onChange="preview_images();" multiple/>

                                <div className="flex-row" id="image_preview">

                                </div>
                            </div>
                            <div className="modal-footer">
                                <ul className="custom-btns">
                                    <li>
                                        <button type="submit" data-dismiss="modal" className="cmn-btn">Cancel</button>
                                    </li>
                                    <li>
                                        <button className="cmn-btn style-2">Upload</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="content-holder">
                        <p className="page-heading">Hold </p>
                        <div className="form-holder">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">First Name</p>
                                        <p className="form-val">Sanjay </p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Last Name</p>
                                        <p className="form-val">singh</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Gender</p>
                                        <p className="form-val">Male</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Contact No</p>
                                        <p className="form-val">+91 9701234567</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Country</p>
                                        <p className="form-val">India</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">City</p>
                                        <p className="form-val">Hyderabad</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Address</p>
                                        <p className="form-val">Nizampet X Roads, Kukatpally, Hyderabad</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Public Address</p>
                                        <p className="form-val">Nizampet X Roads, Kukatpally, Hyderabad</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Citizenship</p>
                                        <p className="form-val">Indian</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <p className="form-lbl">Email</p>
                                        <p className="form-val">sanjaysingh@gmail.com</p>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <p className="form-lbl">Comments</p>
                                        <p className="form-val">
                                            <textarea placeholder="Comments here ..." cols="30" rows="4"></textarea>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="action-swiper">

                        <ul className="custom-btns">
                            <li className=""> <button type="submit" onClick={this.homeHandleClick}> Home </button> </li>
                            <li><button type="submit" className="cmn-btn ">Whitelist</button> </li>
                            <li><button type="submit" className="cmn-btn ">Blacklist</button> </li>
                            <li><button type="submit" className="cmn-btn" data-toggle="modal" data-target="#exampleModal">Additional Info</button> </li>
                            <li className="custom-li">
                            <button type="submit" className="cmn-btn circle-btn"> <span className="fa fa-angle-double-left"></span> </button>
                            <button type="submit" className="cmn-btn circle-btn"> <span className="fa fa-angle-double-right"></span> </button>
                            </li>
                        </ul>

                    </div>
                </div>
                <div className="item right-sec">
                    <div className="docs-holder">
                        <p className="page-heading">KYC Documents</p>
                        <div className="docs-sec">
                            <div id="lightgallery" className="custom-gallery" ref={this.onLightGallery}>
                                <a href="../public/images/pan-card.jpg">
                                    <img alt="" src='../public/images/pan-card.jpg' />
                                </a>
                                <a href="../public/images/Aadhar-card.jpg">
                                    <img alt="thumbnail" src='../public/images/Aadhar-card.jpg' />
                                </a>
                                <a href="../public/images/voter_card.png">
                                    <img src="../public/images/voter_card.png" />
                                </a>
                            </div>

                        </div>
                    </div>
                    <div className="upload-holder">
                        <div>
                            <span>
                                <button type="button" data-toggle="modal" data-target="#upload-files">Upload Files<span className="fa fa-upload"> </span> </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
