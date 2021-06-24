const express = require("express"); // import express
const path = require("path"); // import path

const routes = require(path.join(__dirname, "routes", "index")); // look at index.js file in routes folder

const app = express(); // create express app

app.set("view engine", "ejs"); // use ejs as view engine

app.use('/public', express.static(path.join(__dirname ,'public'))); // declare public folder

// Start listening to given port
const server = app.listen(80, () => {
    console.log(`Running on port ${server.address().port}`);
});

// Let routes folder handle every get and post request
app.get("*", routes);
app.post("*", routes);