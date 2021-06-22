const express = require("express"); // import express

const app = express(); // create express app

// Start listening to given port
const server = app.listen(80, () => {
    console.log(`Running on port ${server.address().port}`);
});

// Send this string for every request
app.get("*", function (req, res) {
	res.send("hey");
});