import Auth from './Auth';
import {IReminderApi, Reminder} from './Reminder';
import {IRouterContext} from './interfaces';
import * as React from 'react';
import {Component, ValidationMap} from 'react';
/**
 * Dashboard component.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export interface IDashboardProps {
}

export interface IDashboardState {
    reminders: IReminderApi[];
}

export class Dashboard extends Component<IDashboardProps, IDashboardState> {
    public context: IRouterContext;

    constructor(props: IDashboardProps) {
        super(props);
        this.state = {
            reminders: [],
        };
        this.loadReminders();
    }

    public static contextTypes: ValidationMap<any> = {
        router: React.PropTypes.object.isRequired,
    };

    private logout(event?: Event): void {
        if (event) {
            event.preventDefault();
        }
        Auth.destroyToken();
        this.context.router.push('/login');
    }

    private loadReminders(): void {
        Auth.ajaxGet('/api/v1/routine_reminders', {}, (error, response) => {
            if (error) {
                if (error.unauthorised) {
                    alert(error.message + ' \nYou will be logged out.');
                    return this.logout();
                }
                return alert(error.message);
            }
            if (response.success) {
                this.setState({
                    reminders: response.data.rows,
                });
            } else {
                alert('Request failed for an unknown reason.');
            }
        });
    }

    private renderReminders(): JSX.Element[] {
        return this.state.reminders.map((reminder) => (
            <Reminder ref={'reminder-' + reminder.id} key={reminder.id} reminder={reminder}/>
        ));
    }

    public render(): JSX.Element {
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

                <div className="list-group m-t-1">
                    {this.renderReminders()}
                </div>
            </div>
        );
    }
}
