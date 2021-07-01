const query = require("./private-utils").query;

// Returns row count of given table
exports.getRowCount = async function (table) {
    let result = await query(`SELECT COUNT(*) FROM ${table};`);
    return result[0]['COUNT(*)'];
};

// Returns users by descending score, max 10 people
exports.getTopTen = function () {
    return query("SELECT username, points, correct_winner_guesses, correct_score_guesses FROM user ORDER BY points DESC LIMIT 10;");
};

// Returns point of a user by username
exports.getPoint = async function (username) {
    let result = await query("SELECT points FROM user WHERE username = ?;", [username]);
    return result[0].points;
};

// Returns password of a user by username
exports.getPassword = async function (username) {
    let result = await query("SELECT password FROM user WHERE username = ?;", [username]);
    return result[0].password;
};

// Get logo of a team
exports.getLogo = async function (name) {
    let result = await query("SELECT logo FROM team WHERE name = ?;", [name]);
    return result[0].logo;
};

// Get names of all teams
exports.getAllTeams = async function () {
    let result = await query("SELECT name FROM team;");
    return result.map(x => x.name);
};

// Get names of all tournaments
exports.getAllTournaments = async function () {
    let result = await query("SELECT name FROM tournament;");
    return result.map(x => x.name);
};