const database = require("./initialize-db");

// You give your SQL query and parameters to this function and get a promise that returns rows array
function query(sql, params = []) {
    return new Promise(function (resolve, reject) {
        database.all(sql, params, function (error, rows) {
            if (error)
                reject(error);
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
    return query("SELECT username, points FROM user ORDER BY points DESC LIMIT 10;");
};