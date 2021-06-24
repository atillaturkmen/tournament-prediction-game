const express = require("express"); // import express
const path = require("path"); // import path

const routes = require(path.join(__dirname, "routes", "index")); // look at index.js file in routes folder

const app = express(); // create express app

app.set("view engine", "ejs"); // use ejs as view engine

app.use('/public', express.static(path.join(__dirname, 'public'))); // declare public folder

// Start listening to given port
const server = app.listen(80, () => {
    console.log(`Running on port ${server.address().port}`);
});

// Let routes folder handle every get and post request
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