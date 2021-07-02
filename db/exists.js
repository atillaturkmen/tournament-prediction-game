const query = require("./private-utils").query;

// Returns true if username exists
exports.usernameExists = async function (username) {
    let result = await query("SELECT * FROM user WHERE username = ?;", [username]);
    return result.length != 0;
};

// Returns true if given user is admin
exports.isAdmin = async function (username) {
    let result = await query("SELECT * FROM admin INNER JOIN user ON user.id = admin.user_id WHERE user.username = ?;", [username]);
    return result.length != 0;
};

// Returns true if team exists in db
exports.teamExists = async function (name) {
    let result = await query("SELECT * FROM team WHERE name = ?;", [name]);
    return result.length != 0;
};

// Returns true if tournament exists in db
exports.tournamentExists = async function (name) {
    let result = await query("SELECT * FROM tournament WHERE name = ?;", [name]);
    return result.length != 0;
};

// Returns true if match exists in db
exports.matchExists = async function (id) {
    let result = await query("SELECT * FROM match WHERE id = ?;", [id]);
    return result.length != 0;
};

// Returns true if match exists in db
exports.guessExists = async function (match_id, username) {
    let result = await query("SELECT * FROM score_guess INNER JOIN user ON user.id = score_guess.user_id WHERE user.username = ? and score_guess.match_id = ?;", [username, match_id]);
    return result.length != 0;
};