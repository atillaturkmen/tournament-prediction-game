const query = require("./private-utils").query;

// Changes username of a user
exports.changeUserName = function (newUsername, oldUsername) {
    return query("UPDATE user SET username = ? WHERE username = ?;", [newUsername, oldUsername]);
};

// Changes password of a user
exports.changePassword = function (newPass, username) {
    return query("UPDATE user SET password = ? WHERE username = ?;", [newPass, username]);
};

// Update logo of a team
exports.changeLogo = function (name, logo) {
    return query("UPDATE team SET logo = ? WHERE name = ?;", [logo, name]);
};

// Update match info
exports.changeMatch = function (match_id, home_team, away_team, time, tournament) {
    return query("UPDATE match SET home_team = ?, away_team = ?, time = ?, in_tournament = ? WHERE id = ?;", [home_team, away_team, time, tournament, match_id]);
};

// Update score of a match
exports.enterScore = async function (match_id, home_first, away_first, home_full, away_full) {
    return query(`UPDATE match SET
    home_goals_first_half = ?,
    away_goals_first_half = ?,
    home_goals_full_time = ?,
    away_goals_full_time = ?
    WHERE id = ?;`, [home_first, away_first, home_full, away_full, match_id]);
};

// Update guess of one match by one user
exports.changeGuess = async function (match_id, username, home_first, away_first, home_full, away_full) {
    return query(`UPDATE score_guess SET
    home_goals_first_half = ?,
    away_goals_first_half = ?,
    home_goals_full_time = ?,
    away_goals_full_time = ?
    WHERE match_id = ? AND user_id = (select id from user where username = ?);`, [home_first, away_first, home_full, away_full, match_id, username]);
};

// Set points earned from a match to null
exports.nullifyEarnedFromMatch = async function (match_id) {
    return query(`UPDATE score_guess SET
    points_earned = NULL
    WHERE match_id = ?;`, [match_id]);
};

// Give points to a user
exports.givePoint = async function (user_id, values) {
    query(`UPDATE user SET
    correct_winner_guesses = correct_winner_guesses + ?,
    correct_score_guesses = correct_score_guesses + ?,
    points = points + ?
    WHERE id = ?;`, [...values, user_id]);
};

// Give points to a user
exports.subtractPoint = async function (user_id, values) {
    query(`UPDATE user SET
    correct_winner_guesses = correct_winner_guesses - ?,
    correct_score_guesses = correct_score_guesses - ?,
    points = points - ?
    WHERE id = ?;`, [...values, user_id]);
};

// Set points of a user guess
exports.givePointToGuess = async function (user_id, match_id, point) {
    query(`UPDATE score_guess SET
    points_earned = ?
    WHERE user_id = ? AND match_id = ?;`, [point, user_id, match_id]);
};