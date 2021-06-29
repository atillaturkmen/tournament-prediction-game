const database = require("./initialize-db");

// You give your SQL query and parameters to this function and get a promise that returns rows array
function query(sql, params = []) {
    return new Promise(function (resolve, reject) {
        database.all(sql, params, function (error, rows) {
            if (error)
                console.log(error);
            else
                resolve(rows);
        });
    });
}

// Creates a user in user table with given username and password
exports.createUser = function (username, pass) {
    return query("INSERT INTO user (username, password) VALUES (?, ?);", [username, pass]);
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

// Returns true if username exists
exports.usernameExists = async function (username) {
    let result = await query("SELECT * FROM user WHERE username = ?;", [username]);
    return result.length != 0;
};

// Returns point of a user by username
exports.getPassword = async function (username) {
    let result = await query("SELECT password FROM user WHERE username = ?;", [username]);
    return result[0].password;
};

// Changes username of a user
exports.changeUserName = function (newUsername, oldUsername) {
    return query("UPDATE user SET username = ? WHERE username = ?;", [newUsername, oldUsername]);
};

// Changes password of a user
exports.changePassword = function (newPass, username) {
    return query("UPDATE user SET password = ? WHERE username = ?;", [newPass, username]);
};

// Returns true if given user is admin
exports.isAdmin = async function (username) {
    let result = await query("SELECT * FROM admin INNER JOIN user ON user.id = admin.user_id WHERE user.username = ?;", [username]);
    return result.length != 0;
};

// Adds an admin to db
exports.addAdmin = function (username) {
    return query("INSERT INTO admin (user_id) VALUES ((SELECT id FROM user WHERE username = ?));", [username]);
};

// Returns row count of given table
exports.getRowCount = async function (table) {
    let result = await query(`SELECT COUNT(*) FROM ${table};`);
    return result[0]['COUNT(*)'];
};

// Adds a team to db
exports.addTeam = function (name, logo) {
    return query("INSERT INTO team (name, logo) VALUES (?, ?);", [name, logo]);
};

// Returns true if team exists in db
exports.teamExists = async function (name) {
    let result = await query("SELECT * FROM team WHERE name = ?;", [name]);
    return result.length != 0;
};

// Update logo of a team
exports.updateLogo = async function (name, logo) {
    return query("UPDATE team SET logo = ? WHERE name = ?;", [logo, name]);
};

// Get logo of a team
exports.getLogo = async function (name) {
    let result = await query("SELECT logo FROM team WHERE name = ?;", [name]);
    return result[0].logo;
};