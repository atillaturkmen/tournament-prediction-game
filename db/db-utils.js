const bcrypt = require("bcrypt"); // used for hashing passwords

module.exports = {
    ...require('./select'),
    ...require('./update'),
    ...require('./insert'),
    ...require('./exists'),
    wrongPass: async function (username, pass, res) {
        let password = await this.getPassword(username);
        let pass_check = await bcrypt.compare(pass, password);
        if (!pass_check) {
            res.render("message", { message: "Wrong password" });
        }
        return !pass_check;
    },
};