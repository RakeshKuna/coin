import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route,Switch } from 'react-router';
import RenderRoutes from './routers/mlcRoutes';
const browserHistory = createBrowserHistory();
import createBrowserHistory from 'history/createBrowserHistory';
import { createStore,applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import LoginReducer from '../client/views/reducers/LoginReducers';

const rootReducer = combineReducers({
    LoginReducer: LoginReducer
});

let mlcStore = createStore(rootReducer,applyMiddleware(thunk));

export default class app extends React.Component {
    render () {
        return (

                <Router history={browserHistory}>
                    <Provider store={mlcStore}>
                        <RenderRoutes />
                    </Provider>
                </Router>

        )
    }
}

