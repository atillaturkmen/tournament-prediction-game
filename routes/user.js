// These two have to be in all router files
const express = require("express"); // import express
const router = express.Router();

const db_utils = require("../db/db-utils"); // you can import our database utility functions like so

router.get("/user", async (req, res) => {
    // Render login page if user is not logged in
    if (!req.session.loggedin) {
        res.redirect("/account/login");
    } else {
        res.redirect("/user/" + req.session.username);
    }
});

router.get("/user/:username", async (req, res) => {
    let username = req.params.username;
    let guesses = await db_utils.getUserGuesses(username);
    for (let i = 0; i < guesses.length; i++) {
        if (guesses[i].points_earned) {
            guesses[i].points_earned = "+" + guesses[i].points_earned;
        }
        guesses[i].time = guesses[i].time.split(" ").join("T");
        guesses[i].show = (req.session.username === username) || (new Date(guesses[i].time + "+03:00") - 3600000 < new Date());
    }
    res.render("user", {
        username: username,
        guesses: guesses,
        self: req.session.username === username,
    });
});

module.exports = router; // this line is needed for importing, necessary for all router files