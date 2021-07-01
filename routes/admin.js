// These two have to be in all router files
const express = require("express"); // import express
const router = express.Router();

const db_utils = require("../db/db-utils"); // import our database utility functions
const helper = require("../helper");

// Can not access any of this routes if user is not admin
router.use(async (req, res, next) => {
    if (!await db_utils.isAdmin(req.session.username)) {
        res.status(403);
        res.render("message", { message: "You do not have permission to access here." });
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
    res.render("admin/addmin", { adminCount: adminCount });
});

router.get("/admin/team", async (req, res) => {
    let teamCount = await db_utils.getRowCount("team");
    res.render("admin/team", { teamCount: teamCount });
});

router.get("/admin/tournament", async (req, res) => {
    let tournamentCount = await db_utils.getRowCount("tournament");
    res.render("admin/tournament", { tournamentCount: tournamentCount });
});

router.get("/admin/match", async (req, res) => {
    let matchCount = await db_utils.getRowCount("match");
    let allTeams = await db_utils.getAllTeams();
    res.render("admin/match", {
        matchCount: matchCount,
        teams: JSON.stringify(allTeams),
    });
});

router.get("/admin/score", (req, res) => {
    res.send("burada skor eklenecek");
});

// ---------- POST request handlers -----------

router.post("/admin/add", async (req, res) => {
    let new_admin = req.body.new_admin;
    if (await helper.wrongPass(req.session.username, req.body.password.toString(), res)) return;
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

router.post("/admin/tournament", async (req, res) => {
    let tournament = req.body.tournament;
    tournament = tournament.toLowerCase();
    tournament = tournament.trim();
    if (await db_utils.tournamentExists(tournament)) {
        return res.render("message", { message: "This tournament already exists." });
    }
    await db_utils.addTournament(tournament);
    res.render("message", { message: "New tournament added." });
});

module.exports = router; // this line is needed for importing, necessary for all router files