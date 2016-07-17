import * as React from "react";
import {Component} from "react";
/**
 * Login component.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export interface ILoginProps { compiler: string; framework: string; }

export class Login extends Component<ILoginProps, {}> {
    public render() {
        return (
            <h1>LOGIN</h1>
        );
    }
}
