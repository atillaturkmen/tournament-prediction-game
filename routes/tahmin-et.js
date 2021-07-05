// These two have to be in all router files
const express = require("express"); // import express
const router = express.Router();

const db_utils = require("../db/db-utils"); // import our database utility functions
const helper = require("../helper");


router.get("/tahmin-et", async (req, res) => {
    let matches = await db_utils.getEmptyMatches();
    helper.changeDateDisplayOfMatches(matches);
    res.render("tahmin-et", {
        matches: matches,
    });
});

// Can not make guesses if user is not logged in
router.use(async (req, res, next) => {
    if (!req.session.loggedin) {
        req.session.redirectTo = '/tahmin-et';
        res.redirect("/account/login");
    } else {
        next();
    }
});

router.get("/tahmin-et/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    let match = await db_utils.getMatchById(match_id);
    res.render("tahmin-et-form", {
        match: match,
    });
});

router.post("/tahmin-et/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    let home_first = req.body.home_first_half || null;
    let away_first = req.body.away_first_half || null;
    let home_full = req.body.home_full_time || null;
    let away_full = req.body.away_full_time || null;
    if (!((home_first && away_first) || (home_full && away_full))) {
        return res.render("message", { message: "Guess first half or full time." });
    }
    let username = req.session.username;
    if (await db_utils.guessExists(match_id, username)) {
        await db_utils.changeGuess(match_id, username, home_first, away_first, home_full, away_full);
        res.render("message", { message: "Guess updated." });
    } else {
        await db_utils.addGuess(match_id, username, home_first, away_first, home_full, away_full);
        res.render("message", { message: "Guess added." });
    }
});

module.exports = router; // this line is needed for importing, necessary for all router files