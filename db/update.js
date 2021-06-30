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