/**
 * API class
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export interface IApiResponse {
    success: boolean;
    message: string;
    data: any;
}

export interface IUserCredentials {
    username: string;
    password: string;
}

export interface IApiError {
    blame: string;
    message: string;
    status: number;
}

export class API {
    public static get(url: string, data: any, callback: (error: IApiError, response: IApiResponse) => void): void {
        API.ajax('GET', url, data, callback);
    }

    public static post(url: string, data: any, callback: (error: IApiError, response: IApiResponse) => void): void {
        API.ajax('POST', url, data, callback);
    }

    private static ajax(type: string, url: string, data: any,
                        callback: (error: IApiError, response?: IApiResponse) => void): void {
        $.ajax({
            data: data,
            dataType: 'json',
            success: function (response: any): void {
                callback(undefined, response);
            },
            type: type,
            url: url,
        }).fail(function (xhr: any, textStatus: string, errorThrown: string): void {
            let blame: string = (xhr.status + '')[0] === '5' ? 'server' : 'client';
            let response: IApiResponse = $.parseJSON(xhr.responseText);
            let message: string;
            if (typeof response === 'object' && response.message) {
                message = response.message;
            } else {
                message = errorThrown;
            }
            callback({
                blame,
                message,
                status: xhr.status,
            });
        });
    }
}
