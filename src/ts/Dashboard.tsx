import Auth from "./Auth";
import * as React from "react";
import {Component} from "react";
/**
 * Dashboard component.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export interface IDashboardProps {
    compiler: string;
    framework: string;
    history: any;
}

export class Dashboard extends Component<IDashboardProps, {}> {
    private logout(event) {
        event.preventDefault();
        Auth.destroyToken();
        this.props.history.push('/login');
    }

    public render() {
        return (
            <div className="container p-t-3">
                <nav className="navbar navbar-fixed-top navbar-light bg-faded">
                    <div className="container">
                        <a className="navbar-brand" href="/">euql1n Hub</a>
                        <ul className="nav navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" onClick={this.logout.bind(this)} href="#">Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <ul className="list-group m-t-1">
                    <li className="list-group-item list-group-item-success">Dapibus ac facilisis in</li>
                    <li className="list-group-item list-group-item-info">Cras sit amet nibh libero</li>
                    <li className="list-group-item list-group-item-warning">Porta ac consectetur ac</li>
                    <li className="list-group-item list-group-item-danger">Vestibulum at eros</li>
                    <li className="list-group-item list-group-item-success">Dapibus ac facilisis in</li>
                    <li className="list-group-item list-group-item-info">Cras sit amet nibh libero</li>
                    <li className="list-group-item list-group-item-warning">Porta ac consectetur ac</li>
                    <li className="list-group-item list-group-item-danger">Vestibulum at eros</li>
                </ul>
            </div>
        );
    }
}
