import {IUserCredentials} from "./Api";
import Auth from "./Auth";
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

export interface ILoginProps {
    compiler: string;
    framework: string;
    location: any;
    router: any;
    history: any;
}

export interface ILoginState {
    errorMessage: string;
}

export class Login extends Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            errorMessage: null,
        };
    }

    private signIn(event: Event) {
        event.preventDefault();

        let credentials: IUserCredentials = {
            password: this.refs.password.value,
            username: this.refs.username.value,
        };

        Auth.requestToken(credentials, (error) => {
            if (error) {
                return this.setState({errorMessage: error.message});
            }
            this.props.history.push('/');
        });
    }

    public render() {
        return (
            <div className="container m-t-1">
                <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <div className="card">
                            <div className="card-header">Please sign in</div>
                            <div className="card-block">
                                {this.state.errorMessage ? (
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.errorMessage}
                                    </div>
                                ) : null}
                                <form onSubmit={this.signIn.bind(this)}>
                                    <div className="form-group">
                                        <label className="sr-only" htmlFor="username">Username</label>
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-user"
                                                                                  aria-hidden="true"/></div>
                                            <input ref="username" type="text" className="form-control" id="username"
                                                   placeholder="Username"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only" htmlFor="password">Password</label>
                                        <div className="input-group">
                                            <div className="input-group-addon"><i className="fa fa-unlock-alt"
                                                                                  aria-hidden="true"/></div>
                                            <input ref="password" type="password" className="form-control" id="password"
                                                   placeholder="Password"/>
                                        </div>
                                    </div>
                                    <input className="btn btn-primary" type="submit" value="Login"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
