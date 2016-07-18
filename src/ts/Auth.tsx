import {API, IApiError, IApiResponse, IUserCredentials} from './Api';
/**
 * Auth class
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export interface IAuthError {
    unauthorised: boolean;
    message: string;
}

export default class Auth {
    private static authorised: boolean = !!localStorage.getItem('token');
    private static token: string = localStorage.getItem('token') || undefined;

    public static requestToken(request: IUserCredentials, callback: (error?: IAuthError) => void): void {
        if (!request.username || !request.password) {
            return callback({
                message: 'Fill all fields.',
                unauthorised: true,
            });
        }
        API.post('/api/v1/auth', request, function (error: IApiError, response: IApiResponse): void {
            if (error) {
                return callback({
                    message: 'A ' + error.blame + ' has occurred: ' + error.message,
                    unauthorised: true,
                });
            }
            Auth.setToken(response.data);
            callback();
        });
    }

    private static setToken(token: string): void {
        Auth.authorised = true;
        Auth.token = token;
        localStorage.setItem('token', token);
    }

    public static destroyToken(): void {
        Auth.authorised = false;
        Auth.token = undefined;
        localStorage.removeItem('token');
    }

    public static isAuthorised(): boolean {
        return Auth.authorised;
    }

    public static ajaxGet(url: string,
                          data: any = {},
                          callback: (error: IAuthError, response: IApiResponse) => void): void {
        data.auth_token = Auth.token;
        API.get(url, data, Auth.ajaxCallback.bind(this, callback));
    }

    public static ajaxPost(url: string,
                           data: any = {},
                           callback: (error: IAuthError, response: IApiResponse) => void): void {
        data.auth_token = Auth.token;
        API.post(url, data, Auth.ajaxCallback.bind(this, callback));
    }

    public static ajaxCallback(callback: (error: IAuthError, response?: IApiResponse) => void,
                               error: IApiError,
                               response: IApiResponse): void {
        if (error) {
            return callback({
                message: error.message,
                unauthorised: error.status === 401 || error.status === 403,
            });
        }
        callback(undefined, response);
    }
}
