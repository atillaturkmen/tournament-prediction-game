const database = require("./initialize-db");

// You give your SQL query and parameters to this function and get a promise that returns rows array
exports.query = function (sql, params = []) {
    return new Promise(function (resolve, reject) {
        database.all(sql, params, function (error, rows) {
            if (error)
                console.log(error);
            else
                resolve(rows);
        });
    });
};