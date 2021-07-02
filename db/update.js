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
exports.changeLogo = async function (name, logo) {
    return query("UPDATE team SET logo = ? WHERE name = ?;", [logo, name]);
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

// Update logo of a team
exports.changeGuess = async function (match_id, username, home_first, away_first, home_full, away_full) {
    return query(`UPDATE score_guess SET
    home_goals_first_half = ?,
    away_goals_first_half = ?,
    home_goals_full_time = ?,
    away_goals_full_time = ?
    WHERE match_id = ? AND user_id = (select id from user where username = ?);`, [home_first, away_first, home_full, away_full, match_id, username]);
};