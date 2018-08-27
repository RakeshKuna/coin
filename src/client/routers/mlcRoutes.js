import React, {Component} from 'react';

import {Router, Route, Switch} from 'react-router';

import loadingPage from '../views/loader';
import loginPage from '../views/login';
import registerPage from '../views/register';
import Header from '../views/layouts/header';
import Footer from '../views/layouts/footer';
import CustomHeader from '../views/layouts/customHeader';
import CustomFooter from '../views/layouts/customFooter';
import landingPage from '../views/containers/landing';
import ListingPage from '../views/containers/listingPage';
import ThanksPage from '../views/containers/thanksPage';
import whitelistPage from '../views/containers/whitelistValidate';
import transferThankyouPage from '../views/containers/transferThankyou';
import addCity from '../views/containers/addCity';
import addCountry from '../views/containers/addCountry';

import EmailTemplateFormatter from '../views/containers/EmailTemplateFormatter';
import mathEth from '../views/containers/transactionDetails';
import secondaryRegistration from '../views/containers/secondaryRegistration';
import SecondaryRegistrationThankyouPage from '../views/containers/secondaryRegistrationThankyouPage';
import Transfer from '../views/containers/transfer';
import transferDetails from "../views/containers/transferDetails";

const DefaultLayout = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={matchProps => (
            <div className="main-container">
                <Header/>
                <div className="main-content-section">
                    <Component {...matchProps} />
                </div>
                <Footer/>
            </div>
        )}/>
    )
};
const CustomLayout = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={matchProps => (
            <div className="reg-container dark-theme">
                <CustomHeader/>
                <div className="reg-content-section">
                    <Component {...matchProps} />
                </div>
                <CustomFooter />
            </div>
        )} />
    )
};

const RenderRoutes = () => {
    return <div className="routes-block">
        <Switch>
            <CustomLayout  path="/whitelistPage" component={whitelistPage}/>
            <CustomLayout path="/transferThankyou" component={transferThankyouPage}/>
            <Route path="/login" component={loginPage}/>
            <Route path="/register" component={registerPage}/>
            <Route path="/addCity" component={addCity}/>    
            <Route path="/addCountry" component={addCountry}/>  
            <CustomLayout exact path="/" component={secondaryRegistration}/> {/*/interest*/}

            <DefaultLayout path="/landing" component={landingPage}/>
            <DefaultLayout  path="/emailTemplateFormatter" component={EmailTemplateFormatter} />
            <DefaultLayout  path="/transactionDetails" component={mathEth} />
            <DefaultLayout path="/listingPage/:pageName" component={ListingPage}/>
            <DefaultLayout path="/transfer" component={Transfer}/>
            <DefaultLayout path="/transferDetails" component={transferDetails}/>

            <CustomLayout path="/thanks" component={ThanksPage}/>
            <CustomLayout path="/secRegThanks" component={SecondaryRegistrationThankyouPage}/>

            {/*<Route path="/toRegistration" component={()=> window.location ="https://register.moolyacoin.io/"}/>*/}

        </Switch>
    </div>
};
export default RenderRoutes;