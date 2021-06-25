// These two have to be in all router files
const express = require("express"); // import express
const router = express.Router();

// let db_utils = require("../db/db-utils"); // you can import our database utility functions like so

router.get("/user/:username", (req, res) => {
    let username = req.params.username; // parameter after user can be used like this
    // db_utils.createUser(username, "test"); // and use them like this
    res.send("TODO");
});

module.exports = router; // this line is needed for importing, necessary for all router files