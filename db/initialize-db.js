const sqlite3 = require('sqlite3').verbose();

let database = new sqlite3.Database(process.env.db_path, (error) => {
    if (error) {
        return console.error(error.message);
    } else {
        console.log('Connected to SQlite database.');
    }
});

module.exports = database;