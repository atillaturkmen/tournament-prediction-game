const query = require("./private-utils").query;

// Returns row count of given table
exports.getRowCount = async function (table) {
    let result = await query(`SELECT COUNT(*) FROM ${table};`);
    return result[0]['COUNT(*)'];
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

// Returns password of a user by username
exports.getPassword = async function (username) {
    let result = await query("SELECT password FROM user WHERE username = ?;", [username]);
    return result[0].password;
};

// Get logo of a team
exports.getLogo = async function (name) {
    let result = await query("SELECT logo FROM team WHERE name = ?;", [name]);
    return result[0].logo;
};

// Get names of all teams
exports.getAllTeams = async function () {
    let result = await query("SELECT name FROM team;");
    return result.map(x => x.name);
};

// Get names of all tournaments
exports.getAllTournaments = async function () {
    let result = await query("SELECT name FROM tournament;");
    return result.map(x => x.name);
};

// Get matches that don't have score information sorted by date with team logos
exports.getEmptyMatches = async function () {
    return query(`
    SELECT
        id,
        home_team,
        a.logo AS home_team_logo,
        away_team,
        b.logo AS away_team_logo,
        time,
        in_tournament
    FROM
        match
    INNER JOIN
        team AS a ON match.home_team = a.name,
        team AS b ON match.away_team = b.name
    WHERE
        home_goals_full_time IS NULL
    ORDER BY
        datetime(time) ASC;`);
};

// Get all matches with team logos
exports.getAllMatches = async function () {
    return query(`
    SELECT
        match.*,
        a.logo AS home_team_logo,
        b.logo AS away_team_logo
    FROM
        match
    INNER JOIN
        team AS a ON match.home_team = a.name,
        team AS b ON match.away_team = b.name
    ORDER BY
        datetime(time) DESC;`);
};

// Get match information and team logos by id
exports.getMatchById = async function (id) {
    let result = await query(`
    SELECT
        match.*,
        a.logo AS home_team_logo,
        b.logo AS away_team_logo
    FROM match
    INNER JOIN
        team AS a ON match.home_team = a.name,
        team AS b ON match.away_team = b.name
    WHERE id = ?;`, [id]);
    return result[0];
};

// Get all guesses on a match
exports.getGuesses = async function (match_id) {
    return query("SELECT * FROM score_guess WHERE match_id = ?;", [match_id]);
};

// Get all guesses a user has made
exports.getUserGuesses = async function (username) {
    return query(`
    SELECT
        score_guess.*,
        a.logo AS home_team_logo,
        b.logo AS away_team_logo,
        match.home_goals_first_half AS real_home_first,
        match.home_goals_full_time AS real_home_full,
        match.away_goals_first_half AS real_away_first,
        match.away_goals_full_time AS real_away_full,
        match.home_team,
        match.away_team,
        match.time
    FROM score_guess
    INNER JOIN
        match ON score_guess.match_id = match.id
    INNER JOIN
        team AS a ON match.home_team = a.name,
        team AS b ON match.away_team = b.name
    WHERE user_id = (SELECT id FROM user WHERE username = ?)
    ORDER BY
        datetime(match.time) ASC;`, [username]);
};