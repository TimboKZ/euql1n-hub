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
if(!process.env.PGHOST) process.env.PGHOST = DB_CONFIG.DB_HOST;
if(!process.env.PGPORT) process.env.PGPORT = DB_CONFIG.DB_PORT;
if(!process.env.PGDATABASE) process.env.PGDATABASE = DB_CONFIG.DB_NAME;
if(!process.env.PGUSER) process.env.PGUSER = DB_CONFIG.DB_HOST;
if(!process.env.PGPASSWORD) process.env.PGPASSWORD = DB_CONFIG.DB_PASS;

/**
 * Importing required modules
 */
var express = require('express');
var app = express();
var router = express.Router();
var pg = require('pg');

/**
 * Setting up static files in public directory
 */
app.use(express.static(__dirname + '/public'));

app.get('/api/v1', function (req, res) {
    res.send('<h1>' + process.env.PGUSER + '</h1>');
});

app.listen(SERVER_PORT, function () {
    console.log('euql1n Hub listening on port ' + SERVER_PORT + '!');
});