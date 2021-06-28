const bcrypt = require("bcrypt"); // used for hashing passwords
const db_utils = require("./db/db-utils"); // you can import our database utility functions like so

/** Compare passwords with the one in db, return true and redirect to wrong password page if it doesn't match*/
exports.wrongPass = async function (username, pass, res) {
    let password = await db_utils.getPassword(username);
    let pass_check = await bcrypt.compare(pass, password);
    if (!pass_check) {
        res.render("message", { message: "Wrong password" });
    }
    return !pass_check;
};