const express = require("express"); // framework for nodejs
const path = require("path"); // useful for joining file paths
const session = require('express-session'); // keeps sessions
const sqlite3 = require('sqlite3').verbose();
const SqliteStore = require("express-session-sqlite").default(session);
require('dotenv').config(); // read environment variables from .env

const app = express(); // create express app

app.set("view engine", "ejs"); // use ejs as view engine

app.use('/public', express.static(path.join(__dirname, 'public'))); // declare public folder

app.use(express.urlencoded({
    extended: false
}));

// initialize session values
app.use(session({
    // use sqlite store, default store leaks memory
    store: new SqliteStore({
        // Database library to use. Any library is fine as long as the API is compatible
        // with sqlite3, such as sqlite3-offline
        driver: sqlite3.Database,
        // for in-memory database
        // path: ':memory:'
        path: process.env.db_path,
        // Session TTL in milliseconds
        ttl: 86400000 * 30, // 30 days
        // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
        cleanupInterval: 86400000,
    }),
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 * 30 } // cookies expire after 30 days, users has to login every month
}));

// Start listening to given port
const server = app.listen(80, () => {
    console.log(`Running on port ${server.address().port}`);
});

// Send loggedIn data to all pages
app.use(function(req, res, next) {
    res.locals.loggedin = req.session.loggedin;
    next();
});

// Let routes folder handle every get and post request
const routes = require(path.join(__dirname, "routes", "index")); // look at index.js file in routes folder
app.get("*", routes);
app.post("*", routes);

// If routes above could not respond, then page does not exist
app.use(function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
});

// If there is an error this function is fired
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500);
    res.render('message', { message: "hata oldu" });
});