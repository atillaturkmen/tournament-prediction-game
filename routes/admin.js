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

// ---------- GET request handlers -----------

router.get("/admin", async (req, res) => {
    res.render("admin/admin");
});

router.get("/admin/add", async (req, res) => {
    let adminCount = await db_utils.getRowCount("admin");
    res.render("admin/add", { adminCount: adminCount });
});

router.get("/admin/team", async (req, res) => {
    let teamCount = await db_utils.getRowCount("team");
    res.render("admin/team", { teamCount: teamCount });
});

router.get("/admin/match", (req, res) => {
    res.send("burada maç eklenecek");
});

router.get("/admin/score", (req, res) => {
    res.send("burada skor eklenecek");
});

// ---------- POST request handlers -----------

router.post("/admin/add", async (req, res) => {
    let new_admin = req.body.new_admin;
    if (await helper.wrongPass(req.session.username, req.body.password, res)) return;
    if (!await db_utils.usernameExists(new_admin)) {
        return res.render("message", { message: "This user does not exist." });
    }
    if (await db_utils.isAdmin(new_admin)) {
        return res.render("message", { message: "This user is already an admin." });
    }
    await db_utils.addAdmin(new_admin);
    res.render("message", { message: "New admin added." });
});

router.post("/admin/team", async (req, res) => {
    let name = req.body.team_name;
    let logo = req.body.team_logo;
    name = name.toLowerCase();
    name = name.trim();
    logo = logo.trim();
    if (logo == "") {
        logo = "https://sshraevents.org/wp-content/uploads/2019/12/nologo.png";
    }
    if (await db_utils.teamExists(name)) {
        await db_utils.changeLogo(name, logo);
        return res.render("message", { message: "Team logo updated." });
    }
    await db_utils.addTeam(name, logo);
    res.render("message", { message: "Team added." });
});

module.exports = router; // this line is needed for importing, necessary for all router files