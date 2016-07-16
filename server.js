/**
 * Main server file for euql1n Hub
 *
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * Config section
 */
var SERVER_PORT = 3000;

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(SERVER_PORT, function () {
    console.log('Example app listening on port ' + SERVER_PORT + '!');
});