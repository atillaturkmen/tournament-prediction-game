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
    Promise.all([db_utils.getRowCount("match"), db_utils.getAllTournaments(), db_utils.getAllTeams()]).then((values) => {
        let matchCount = values[0];
        let allTournaments = values[1].map(x => x.toUpperCase()); // capitalize all letters
        let allTeams = values[2].map(x => helper.capitalizeTheFirstLetterOfEachWord(x)); // capitalize first letters
        res.render("admin/match", {
            matchCount: matchCount,
            teams: JSON.stringify(allTeams),
            tournaments: JSON.stringify(allTournaments),
        });
    });
});

router.get("/admin/score", (req, res) => {
    res.send("burada skor eklenecek");
});

// ---------- POST request handlers -----------

router.post("/admin/add", async (req, res) => {
    let new_admin = req.body.new_admin;
    if (await db_utils.wrongPass(req.session.username, req.body.password.toString(), res)) return;
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
    tournament = tournament.toLowerCase().trim();
    if (await db_utils.tournamentExists(tournament)) {
        return res.render("message", { message: "This tournament already exists." });
    }
    await db_utils.addTournament(tournament);
    res.render("message", { message: "New tournament added." });
});

router.post("/admin/match", async (req, res) => {
    let home_team = req.body.home_team;
    let away_team = req.body.away_team;
    let time = req.body.time;
    let tournament = req.body.in_tournament;
    home_team = home_team.toLowerCase().trim();
    away_team = away_team.toLowerCase().trim();
    tournament = tournament.toLowerCase().trim();
    time = time.substring(0, 10) + " " + time.substring(10 + 1); // Replace T at the middle with a space for sqlite

    // Team related checks
    if (!await db_utils.teamExists(home_team)) {
        return res.render("message", { message: "Home team does not exist in database." });
    }
    if (!await db_utils.teamExists(away_team)) {
        return res.render("message", { message: "Away team does not exist in database." });
    }
    if (home_team == away_team) {
        return res.render("message", { message: "Home team and away team can not be the same team." });
    }
    // Tournament checks
    if (tournament == "") {
        db_utils.addMatchWithoutTournament(home_team, away_team, time);
    } else if (!await db_utils.tournamentExists(tournament)) {
        return res.render("message", { message: "This tournament does not exist in database." });
    } else {
        db_utils.addMatchWithTournament(home_team, away_team, time, tournament);
    }

    res.render("message", { message: "Match added." });
});

module.exports = router; // this line is needed for importing, necessary for all router files