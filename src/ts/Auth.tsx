/**
 * Auth class
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export default class Auth {
    private static authorised: boolean = false;
    private static token: string;

    public static isAuthorised(): boolean {
        return this.authorised;
    }
}
