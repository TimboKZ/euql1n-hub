import Auth from './Auth';
import {Dashboard} from './Dashboard';
import {Login} from './Login';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {RedirectFunction, Route, Router, RouterState, browserHistory} from 'react-router';
/**
 * Main euql1n-hub script.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

function requireAuth(nextState: RouterState, replace: RedirectFunction): void {
    if (!Auth.isAuthorised()) {
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname},
        });
    }
}

function checkAuth(nextState: RouterState, replace: RedirectFunction): void {
    if (Auth.isAuthorised()) {
        replace({
            pathname: '/',
            state: {nextPathname: nextState.location.pathname},
        });
    }
}

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={Dashboard} onEnter={requireAuth}/>
        <Route path="/login" component={Login} onEnter={checkAuth}/>
    </Router>
), document.getElementById('root'));
