const query = require("./private-utils").query;

// Deletes match and its guesses
exports.deleteMatch = async function (match_id) {
    return query("DELETE FROM match WHERE id = ?", [match_id]);
};