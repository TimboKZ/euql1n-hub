/**
 * Main server file for euql1n Hub
 *
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * Importing db.json for local environment
 */
var DB_CONFIG = null;
try {
    DB_CONFIG = require('./db.json');
} catch(e) {
    console.error("DB Config is not found, relying on Heroku environment variables...");
}

/**
 * Config section
 */
const SERVER_PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;
const DB_HOST = process.env.DB_HOST || DB_CONFIG.DB_HOST;
const DB_PORT = process.env.DB_PORT || DB_CONFIG.DB_PORT;
const DB_NAME = process.env.DB_NAME || DB_CONFIG.DB_NAME;
const DB_USER = process.env.DB_USER || DB_CONFIG.DB_USER;
const DB_PASS = process.env.DB_PASS || DB_CONFIG.DB_PASS;

/**
 * Importing required modules
 */
var express = require('express');
var app = express();
var router = express.Router();

/**
 * Setting up static files in public directory
 */
app.use(express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
    res.send('<h1>' + DB_HOST + '</h1>');
    // return res.render('public/index.html');
});

app.listen(SERVER_PORT, function () {
    console.log('euql1n Hub listening on port ' + SERVER_PORT + '!');
});