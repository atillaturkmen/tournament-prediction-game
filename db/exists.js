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