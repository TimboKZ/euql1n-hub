import Auth from "./Auth";
import {IRouterContext} from "./interfaces";
import * as React from "react";
import {Component, ValidationMap} from "react";
/**
 * Reminder component
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export interface IReminderApi {
    id: number;
    name: string;
    description: string;
    is_weekly: boolean;
    weekday: number;
    interval: number;
    completed: string;
}

export interface IReminderProps {
    reminder: IReminderApi;
}

export interface IReminderState {
    completed: Date;
    overdue: boolean;
    overdueDays: number;
}

export class Reminder extends Component<IReminderProps, IReminderState> {
    public context: IRouterContext;

    constructor(props: IReminderProps) {
        super(props);
        let now = new Date();
        let completed = new Date(this.props.reminder.completed);
        let overdueDays = Math.max(0, Math.floor((now.getTime() - completed.getTime()) / (24 * 60 * 60 * 1000)));
        this.state = {
            completed,
            overdue: overdueDays > 0,
            overdueDays: overdueDays,
        };
    }

    public static contextTypes: ValidationMap<any> = {
        router: React.PropTypes.object.isRequired,
    };

    private logout(event: Event = null) {
        if (event) {
            event.preventDefault();
        }
        Auth.destroyToken();
        this.context.router.push('/login');
    }

    private complete(event: Event) {
        event.preventDefault();
        if (confirm('Complete "' + this.props.reminder.name + '"?')) {
            Auth.ajaxPost('/api/v1/routine_reminders/' + this.props.reminder.id, {}, (error, response) => {
                if (error) {
                    if (error.unauthorised) {
                        alert(error.message + ' \nYou will be logged out.');
                        return this.logout();
                    }
                    return alert(error.message);
                }
                console.log(response);
                if (response.success) {
                    this.setState({
                        completed: new Date(),
                        overdue: false,
                        overdueDays: 0,
                    });
                } else {
                    alert('Request failed for an unknown reason.');
                }
            });
        }
    }

    /**
     * TODO: Extract this into a helper class
     *
     * @returns {string}
     */
    public getCompletedString(): string {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December",
        ];

        let date = this.state.completed;
        let day = date.getDate();
        let monthIndex = date.getMonth();
        let year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ', ' + year;
    }

    public render() {
        return (
            <a href="#" onClick={this.complete.bind(this)}
               className={'list-group-item' + (this.state.overdue ? ' list-group-item-warning' : '')}>
                { this.state.overdue ? (
                    <span className="label label-warning label-pill pull-xs-right">Overdue</span>
                ) : null}
                <p className="list-group-item-text">
                    <strong>{this.props.reminder.name}</strong>
                    <br/>
                    {this.props.reminder.description + ' Last completed on ' + this.getCompletedString()}
                    {this.state.overdue ? (
                        <strong>
                            <br/>
                            <br/>
                            {this.state.overdueDays + ' day' + (this.state.overdueDays === 1 ? '' : 's') +
                            ' overdue. Tap to complete.'}
                        </strong>
                    ) : ''}
                </p>
                <div className="clearfix"/>
            </a>
        );
    }
}
