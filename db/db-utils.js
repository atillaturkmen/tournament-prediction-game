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
    return query("UPDATE user SET username = ? WHERE username = ?", [newUsername, oldUsername]);
};

// Changes password of a user
exports.changePassword = function (newPass, username) {
    return query("UPDATE user SET password = ? WHERE username = ?", [newPass, username]);
};

// Returns true if given user is admin
exports.isAdmin = async function (username) {
    let result = await query("SELECT * FROM admin INNER JOIN user ON user.id = admin.user_id WHERE user.username = ?", [username]);
    return result.length != 0;
};

// Returns true if user is already an admin
exports.adminExists = async function (username) {
    let result = await query("SELECT * FROM admin WHERE id = (SELECT id FROM user WHERE username = ?);", [username]);
    return result.length != 0;
};

// Adds an admin to db
exports.addAdmin = function (username) {
    return query("INSERT INTO admin (user_id) VALUES ((SELECT id FROM user WHERE username = ?))", [username]);
};