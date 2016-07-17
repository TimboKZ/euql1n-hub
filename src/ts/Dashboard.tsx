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

export interface IDashboardProps { compiler: string; framework: string; }

export class Dashboard extends Component<IDashboardProps, {}> {
    public render() {
        return (
            <h1>DASHBOARD</h1>
        );
    }
}
