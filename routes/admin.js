// These two have to be in all router files
const express = require("express"); // import express
const router = express.Router();

const db_utils = require("../db/db-utils"); // import our database utility functions
const helper = require("../helper");

// Can not access any of this routes if user is not admin
router.use(async (req, res, next) => {
    if (!await db_utils.isAdmin(req.session.username)) {
        res.redirect("/yasak");
    } else {
        next();
    }
});

router.get("/admin", async (req, res) => {
    res.render("admin/admin");
});

router.get("/admin/add", (req, res) => {
    res.render("admin/add");
});

router.post("/admin/add", async (req, res) => {
    await helper.wrongPass(req.session.username, req.body.password, res);
    if (await db_utils.adminExists) {
        return res.render("message", { message: "This user is already an admin." });
    }
    await db_utils.addAdmin(req.body.new_admin);
    res.render("message", { message: "New admin added." });
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