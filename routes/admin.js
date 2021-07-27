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
        res.render("admin/match", {
            matchCount: values[0],
            tournaments: JSON.stringify(values[1]),
            teams: JSON.stringify(values[2]),
        });
    });
});

router.get("/admin/match/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    Promise.all([db_utils.getRowCount("match"), db_utils.getAllTournaments(), db_utils.getAllTeams(), db_utils.getMatchById(match_id)]).then((values) => {
        res.render("admin/match", {
            matchCount: values[0],
            tournaments: JSON.stringify(values[1]),
            teams: JSON.stringify(values[2]),
            match: values[3],
        });
    });
});

router.get("/admin/score", async (req, res) => {
    let matches = await db_utils.getAllMatches();
    helper.changeDateDisplayOfMatches(matches);
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
    res.render("admin/score-form", {
        match: match,
    });
});

router.get("/admin/delete_score/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    let match = await db_utils.getMatchById(match_id);
    if (match.home_goals_first_half == null) {
        return res.render("message", { message: "Bu maçın zaten skoru yok." });
    }
    let guesses = await db_utils.getGuesses(match_id);
    subtractPoints(guesses);
    db_utils.enterScore(match_id, null, null, null, null);
    db_utils.nullifyEarnedFromMatch(match_id);
    res.render("message", { message: "Maç skoru silinmiş olmalı." });
});

router.get("/admin/delete_match/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    let guesses = await db_utils.getGuesses(match_id);
    subtractPoints(guesses);
    await db_utils.deleteMatch(match_id);
    res.render("message", { message: "Deleted match." });
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
        tournament = null;
    } else if (!await db_utils.tournamentExists(tournament)) {
        return res.render("message", { message: "This tournament does not exist in database." });
    }
    let id = req.query.id;
    if (id) {
        await db_utils.changeMatch(id, home_team, away_team, time, tournament);
        res.render("message", { message: "Match info updated." });
    } else {
        await db_utils.addMatch(home_team, away_team, time, tournament);
        res.render("message", { message: "Match added." });
    }
});

// Update final score of match, give users their points
router.post("/admin/score/:match_id", async (req, res) => {
    let match_id = req.params.match_id;
    if (!await db_utils.matchExists(match_id)) {
        return res.render("message", { message: "This match id is not in database." });
    }
    let guesses = await db_utils.getGuesses(match_id);
    let match = await db_utils.getMatchById(match_id);
    if (match.home_goals_first_half != null) {
        // Here the points earned for each user by that match will be reset and recalculated below
        subtractPoints(guesses);
    }
    // Put to db
    let home_first_real = req.body.home_first_half || null;
    let away_first_real = req.body.away_first_half || null;
    let home_full_real = req.body.home_full_time || null;
    let away_full_real = req.body.away_full_time || null;
    if (!((home_first_real && away_first_real) || (home_full_real && away_full_real))) {
        return res.render("message", { message: "Enter first half or full time." });
    }
    db_utils.enterScore(match_id, home_first_real, away_first_real, home_full_real, away_full_real);
    // Update user points
    let enteredFirstHalf = !!home_first_real;
    let enteredFullTime = !!home_full_real;
    for (let i = 0; i < guesses.length; i++) {
        let fullTime;
        if (enteredFirstHalf && enteredFullTime) {
            let firstHalf = calculatePoint(guesses[i].home_goals_first_half, guesses[i].away_goals_first_half, home_first_real, away_first_real);
            let secondHalf = calculatePoint(guesses[i].home_goals_full_time, guesses[i].away_goals_full_time, home_full_real, away_full_real);
            fullTime = firstHalf.map((x, j) => x + secondHalf[j]);
        }
        else if (enteredFirstHalf) {
            fullTime = calculatePoint(guesses[i].home_goals_first_half, guesses[i].away_goals_first_half, home_first_real, away_first_real);
        } else if (enteredFullTime) {
            fullTime = calculatePoint(guesses[i].home_goals_full_time, guesses[i].away_goals_full_time, home_full_real, away_full_real);
        } else {
            console.log(`Something went wrong when calculating user with id: ${guesses[i].user_id}.`);
        }
        db_utils.givePoint(guesses[i].user_id, fullTime);
        db_utils.givePointToGuess(guesses[i].user_id, guesses[i].match_id, fullTime[2]);
    }
    res.render("message", { message: "Match score and user points updated." });
});

function calculatePoint(a, b, c, d) {
    if (a == null || b == null) return [0, 0, 0];       // no guess
    if (a == c && b == d) return [0, 1, 5];             // correct score
    if ((a - b) * (c - d) > 0) return [1, 0, 2];        // correct winner
    if ((a - b) == 0 && (c - d) == 0) return [1, 0, 2]; // correct winner
    return [0, 0, 0];                                   // incorrect
}

function subtractPoints(guesses) {
    for (let i = 0; i < guesses.length; i++) {
        let correct_score = 0;
        let correct_winner = 0;
        switch (guesses[i].points_earned) {
            case 10:
                correct_score = 2;
                correct_winner = 0;
                break;
            case 7:
                correct_score = 1;
                correct_winner = 1;
                break;
            case 5:
                correct_score = 1;
                correct_winner = 0;
                break;
            case 4:
                correct_score = 0;
                correct_winner = 2;
                break;
            case 2:
                correct_score = 0;
                correct_winner = 1;
                break;
            default:
                break;
        }
        db_utils.subtractPoint(guesses[i].user_id, [correct_winner, correct_score, guesses[i].points_earned]);
    }
}

module.exports = router; // this line is needed for importing, necessary for all router files