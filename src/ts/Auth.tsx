import {API, IUserCredentials} from "./Api";
/**
 * Auth class
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export interface IAuthError {
    message: string;
}

export default class Auth {
    private static authorised: boolean = !!localStorage.getItem('token');
    private static token: string = localStorage.getItem('token') || null;

    public static requestToken(request: IUserCredentials, callback: (error: IAuthError) => void) {
        if (!request.username || !request.password) {
            return callback({message: 'Fill all fields.'});
        }
        API.post('/api/v1/auth', request, function (error, response) {
            if (error) {
                return callback({
                    message: 'A ' + error.blame + ' has occurred: ' + error.message,
                });
            }
            Auth.setToken(response.data);
            callback(null);
        });
    }

    private static setToken(token: string) {
        Auth.authorised = true;
        Auth.token = token;
        localStorage.setItem('token', token);
    }

    public static destroyToken() {
        Auth.authorised = false;
        Auth.token = null;
        localStorage.removeItem('token');
    }

    public static isAuthorised(): boolean {
        return Auth.authorised;
    }
}
