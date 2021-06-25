const database = require("./initialize-db");

// Creates a user in accounts table with given username and password
exports.createUser = function (username, pass) {
    database.all("INSERT INTO account (username, password) VALUES (?, ?);", [username, pass], (err, rows) => {
        if (err) throw err;
    });
};