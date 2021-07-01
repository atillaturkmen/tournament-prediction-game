const query = require("./private-utils").query;

// Creates a user in user table with given username and password
exports.addUser = function (username, pass) {
    return query("INSERT INTO user (username, password) VALUES (?, ?);", [username, pass]);
};

// Adds an admin to db
exports.addAdmin = function (username) {
    return query("INSERT INTO admin (user_id) VALUES ((SELECT id FROM user WHERE username = ?));", [username]);
};

// Adds a team to db
exports.addTeam = function (name, logo) {
    return query("INSERT INTO team (name, logo) VALUES (?, ?);", [name, logo]);
};

// Adds a tournament to db
exports.addTournament = function (name) {
    return query("INSERT INTO tournament (name) VALUES (?);", [name]);
};

// Adds a match to db with tournament value
exports.addMatchWithTournament = function (home_team, away_team, time, tournament) {
    return query("INSERT INTO match (home_team, away_team, time, in_tournament) VALUES (?, ?, ?, ?);", [home_team, away_team, time ,tournament]);
};

// Adds a match to db without tournament value
exports.addMatchWithoutTournament = function (home_team, away_team, time) {
    return query("INSERT INTO match (home_team, away_team, time) VALUES (?, ?, ?);", [home_team, away_team, time]);
};