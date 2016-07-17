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
} catch (e) {
    console.error("DB Config is not found, relying on Heroku environment variables...");
}

/**
 * Config section
 */
const SERVICE_ID = 1;
const SERVER_PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;
const API_PATH = '/api/v1';
const TOKEN_LIFETIME = 2 * 60 * 60 * 1000;
if (!process.env.PGHOST) process.env.PGHOST = DB_CONFIG.DB_HOST;
if (!process.env.PGPORT) process.env.PGPORT = DB_CONFIG.DB_PORT;
if (!process.env.PGDATABASE) process.env.PGDATABASE = DB_CONFIG.DB_NAME;
if (!process.env.PGUSER) process.env.PGUSER = DB_CONFIG.DB_USER;
if (!process.env.PGPASSWORD) process.env.PGPASSWORD = DB_CONFIG.DB_PASS;

/**
 * Importing required modules
 */
var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var pg = require('pg');

/**
 * PostgresSQL pool
 */
var pool = new pg.Pool({
    max: 10,
    idleTimeoutMillis: 30000
});

/**
 * Setting up static files
 */
app.use('/dist', express.static(__dirname + '/dist'));

/**
 * Authorise the API request
 */
app.post(API_PATH + '/auth', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var username = req.body.username;
    var password = req.body.password;
    if (!username && !password) return handleError(res, null, 'Invalid login credentials.', 400);
    dbConnect(res, function (client, done) {
        var invalidCredentials = function () {
            handleError(res, null, 'Unrecognised login credentials.', 400);
            done();
        };
        var query = 'SELECT * FROM users WHERE service_id = ($1) AND username = ($2)';
        var params = [SERVICE_ID, username];
        dbQuery(res, client, query, params, function (result) {
            if (result.rowCount === 1) {
                var row = result.rows[0];
                hashCompare(res, password, row.password, function (match) {
                    if (match) {
                        var token = SERVICE_ID + row.username + ip + new Date().getTime() + Math.random();
                        hashCreate(res, token, function (hash) {
                            query = "INSERT INTO auth_tokens(service_id, user_id, token, expires, ip) values(($1), ($2), ($3), ($4), ($5))";
                            var expires = new Date();
                            expires.setTime(expires.getTime() + TOKEN_LIFETIME);
                            params = [SERVICE_ID, row.id, hash, expires, ip];
                            dbQuery(res, client, query, params, function () {
                                res.json({success: true, data: hash});
                                done();
                            }, done);
                        });
                    } else {
                        invalidCredentials();
                    }
                });
            } else {
                invalidCredentials();
            }
        }, done);
    });
});

/**
 * Return routine reminders
 */
app.get(API_PATH + '/routine_reminders', function (req, res) {
    verifyToken(res, req, function (client, done) {
        var query = 'SELECT * FROM routine_reminders';
        var params = [];
        dbQuery(res, client, query, params, function (result) {
            var response = {
                success: true,
                data: result
            };
            res.json(response);
            done();
        }, done);
    });
});

/**
 * Update a routine reminder
 */
app.post(API_PATH + '/routine_reminders/:id', function (req, res) {
    verifyToken(res, req, function (client, done) {
        var reminder_id = req.body.id;
        var query = 'UPDATE routine_reminders SET completed = ($1) WHERE id = ($2)';
        var params = [new Date(), reminder_id];
        dbQuery(res, client, query, params, function (result) {
            var response = {
                success: true,
                data: result
            };
            res.json(response);
            done();
        }, done);
    });
});

/**
 * Return ongoing subscriptions
 */
app.post(API_PATH + '/ongoing_subscriptions', function (req, res) {
    verifyToken(res, req, function (client, done) {
        var query = 'SELECT * FROM ongoing_subscriptions';
        var params = [];
        dbQuery(res, client, query, params, function (result) {
            var response = {
                success: true,
                data: result
            };
            res.json(response);
            done();
        }, done);
    });
});

/**
 * Routing all requests to index.html
 */
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

/**
 * Verify token submitted in the API request
 *
 * @param res
 * @param req
 * @param callback
 */
function verifyToken(res, req, callback) {
    var auth_token = req.body.auth_token || req.query.auth_token;
    if (!auth_token) return handleError(res, null, 'No auth token provided.', 400);
    dbConnect(res, function (client, done) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var query = 'SELECT user_id, token, expires, ip FROM auth_tokens WHERE token = ($1) AND service_id = ($2)';
        var params = [auth_token, SERVICE_ID];
        dbQuery(res, client, query, params, function (result) {
            if (result.rows.length === 1) {
                var row = result.rows[0];
                if (row.ip === ip) {
                    var now = new Date();
                    var expires = new Date(row.expires);
                    if (expires > now) {
                        now.setTime(now.getTime() + TOKEN_LIFETIME);
                        query = 'UPDATE auth_tokens SET expires = ($1) WHERE id = ($2)';
                        params = [now, row.id];
                        dbQuery(res, client, params, function () {
                            callback(client, done);
                        }, done);
                    } else {
                        handleError(res, null, 'Auth token has expired.', 403);
                        done();
                    }
                } else {
                    handleError(res, null, 'Auth token is invalid for current connection.', 403);
                    done();
                }
            } else {
                handleError(res, null, 'Unrecognised auth token.', 403);
                done();
            }
        }, done);
    });
}

/**
 * Connect to a DB pool and get a client
 *
 * @param res
 * @param callback
 */
function dbConnect(res, callback) {
    pool.connect(function (err, client, done) {
        if (err) return handleError(res, err, 'PostgreSQL error occurred during pool connection.', 500);
        callback(client, done);
    });
}

/**
 * Run an PostgreSQL query
 *
 * @param res
 * @param client
 * @param query
 * @param params
 * @param callback
 * @param done
 */
function dbQuery(res, client, query, params, callback, done) {
    client.query(query, params, function (err, result) {
        if (err) {
            done();
            return handleError(res, err, 'PostgreSQL error occurred during query execution.', 500);
        }
        if (callback) callback(result);
    })
}

/**
 * Hashes a password using bcrypt and supplies it to the callback
 *
 * @param res
 * @param password
 * @param callback
 */
function hashCreate(res, password, callback) {
    bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
        if (err) return handleError(res, err, 'An error occurred while hashing a password using bcrypt.', 500);
        callback(hash);
    });
}

/**
 * Check a password against a hash using bcrypt
 *
 * @param res
 * @param password
 * @param hash
 * @param callback
 */
function hashCompare(res, password, hash, callback) {
    bcrypt.compare(password, hash, function (err, match) {
        if (err) return handleError(res, err, 'An error occurred while comparing a password hash using bcrypt.', 500);
        callback(match);
    });
}

/**
 * Handle PG pool errors
 */
pool.on('error', function (err, client) {
    console.error('PG idle client error.', err.message, err.stack)
});

/**
 * Handle an error
 */
function handleError(res, err, message, status) {
    if (!message) message = 'An error has occurred.';
    if (!status) status = 500;
    var response = {
        success: false,
        message: message,
        data: err
    };
    res.status(status).json(response);
}

/**
 * Start the server
 */
app.listen(SERVER_PORT, function () {
    console.log('euql1n Hub listening on port ' + SERVER_PORT + '!');
});