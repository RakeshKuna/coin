import React, { Component } from 'react';

export default class loader extends React.Component{
    render(){
        return(
            <div className="loader-page">
                <span><i className="fa fa-spinner fa-spin"></i></span>
            </div>
        )
    }
}