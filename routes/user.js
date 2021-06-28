// These two have to be in all router files
const express = require("express"); // import express
const router = express.Router();

let db_utils = require("../db/db-utils"); // you can import our database utility functions like so

router.get("/user", async (req, res) => {
    // Render login page if user is not logged in
    if (!req.session.loggedin) {
        res.redirect("/account/login");
    } else {
        let points = await db_utils.getPoint(req.session.username);
        res.render("user", {
            username: req.session.username,
            points: points,
            self: true,
        });
    }
});

router.get("/user/:username", async (req, res) => {
    let username = req.params.username;
    let points = await db_utils.getPoint(username);
    res.render("user", {
        username: username,
        points: points,
        self: req.session.username === username,
    });
});

module.exports = router; // this line is needed for importing, necessary for all router files