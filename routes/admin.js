// These two have to be in all router files
const express = require("express"); // import express
const router = express.Router();

let db_utils = require("../db/db-utils"); // import our database utility functions

router.get("/admin", async (req, res) => {
    if (await db_utils.isAdmin(req.session.username)) {
        res.render("admin/admin");
    } else {
        res.redirect("/yasak");
    }
});

router.get("/admin/add", (req, res) => {
    res.send("burada admin eklenecek");
});

router.get("/admin/team", (req, res) => {
    res.send("burada takım eklenecek");
});

router.get("/admin/match", (req, res) => {
    res.send("burada maç eklenecek");
});

router.get("/admin/score", (req, res) => {
    res.send("burada skor eklenecek");
});

module.exports = router; // this line is needed for importing, necessary for all router files