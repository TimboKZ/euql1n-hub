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
    public static post(url: string, data: any, callback: (error: IApiError, response: IApiResponse) => void) {
        $.ajax({
            data: data,
            dataType: 'json',
            success: function (response) {
                callback(null, response);
            },
            type: 'POST',
            url: url,
        }).fail(function (xhr, textStatus, errorThrown) {
            console.log(xhr);
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
            }, null);
        });
    }
}
