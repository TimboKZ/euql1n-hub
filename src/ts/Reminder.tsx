import * as React from "react";
import {Component} from "react";
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
    completed: Date;
}

export interface IReminderProps {
    compiler: string;
    framework: string;
    location: any;
    router: any;
    history: any;
}

export interface IReminderState {
    errorMessage: string;
}

export class Reminder extends Component<IReminderProps, IReminderState> {
    constructor(props: IReminderProps) {
        super(props);
        this.state = {
            errorMessage: null,
        };
    }

    public render() {
        return (
            <div href="#" className="list-group-item active">
                <h4 className="list-group-item-heading">List group item heading</h4>
                <p className="list-group-item-text">Risus varius blandit.</p>
            </div>
        );
    }
}
