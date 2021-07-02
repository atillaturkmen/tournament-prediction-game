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
        res.render("admin/match", {
            matchCount: matchCount,
            tournaments: JSON.stringify(values[1]),
            teams: JSON.stringify(values[2]),
        });
    });
});

router.get("/admin/score", async (req, res) => {
    let matches = await db_utils.getEmptyMatches();
    res.render("admin/score", {
        matches: matches,
    });
});

router.get("/admin/score/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    let match = await db_utils.getMatchById(match_id);
    if (match.home_goals_first_half != null) {
        return res.render("message", { message: "This match already has score information." });
    }
    res.render("admin/score-form", {
        match: match,
    });
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
    name = name.trim();
    name = helper.capitalizeTheFirstLetterOfEachWord(name);
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
    tournament = tournament.toUpperCase().trim();
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
    home_team = home_team.trim();
    home_team = helper.capitalizeTheFirstLetterOfEachWord(home_team);
    away_team = away_team.trim();
    away_team = helper.capitalizeTheFirstLetterOfEachWord(away_team);
    tournament = tournament.toUpperCase().trim();
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

router.post("/admin/score/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    // Do not allow modification on scored matches
    let match = await db_utils.getMatchById(match_id);
    if (match.home_goals_first_half != null) {
        return res.render("message", { message: "This match already has score information." });
    }
    // Put to db
    let home_first = req.body.home_first_half;
    let away_first = req.body.away_first_half;
    let home_full = req.body.home_full_time;
    let away_full = req.body.away_full_time;
    await db_utils.enterScore(match_id, home_first, away_first, home_full, away_full);
    res.render("message", { message: "Match score updated." });
});

module.exports = router; // this line is needed for importing, necessary for all router files