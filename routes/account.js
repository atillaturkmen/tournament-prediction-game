// These two have to be in all router files
const express = require("express"); // import express
const bcrypt = require("bcrypt"); // used for hashing passwords
const router = express.Router();

const db_utils = require("../db/db-utils"); // you can import our database utility functions like so

// ---------- GET request handlers -----------

router.get("/account/login", async (req, res) => {
    // Redirect to user page if user is loggedin
    if (req.session.loggedin) {
        res.redirect("/user");
    } else {
        res.render("account/login");
    }
});

router.get("/account/register", async (req, res) => {
    // Redirect to user page if user is loggedin
    if (req.session.loggedin) {
        res.redirect("/user");
    } else {
        res.render("account/register");
    }
});

router.get("/account/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

router.get("/account/change_username", async (req, res) => {
    if (req.session.loggedin) {
        res.render("account/change_username");
    } else {
        res.redirect("/account/login");
    }
});

router.get("/account/change_password", async (req, res) => {
    if (req.session.loggedin) {
        res.render("account/change_password");
    } else {
        res.redirect("/account/login");
    }
});

// ---------- POST request handlers -----------

// Creates user
router.post("/account/signup", async (req, res) => {
    let username_input = req.body.username;
    let password_input = req.body.password.toString();
    let password_confirm = req.body.password_confirm.toString();
    // Check confirm password
    if (password_confirm != password_input) {
        return res.render("message", { message: "Passwords don't match." });
    }
    // Check the db if username exists
    if (await db_utils.usernameExists(username_input)) {
        return res.render("message", { message: "This username is taken, try again." });
    }
    // Hash the password
    let hashedPassword = await hashPassword(password_input);
    // Create and login
    await db_utils.addUser(username_input, hashedPassword);
    login(req, res, username_input);
});

// Handles login
router.post("/account/auth", async (req, res) => {
    let username_input = req.body.username;
    let password_input = req.body.password.toString();

    // Check the db if username exists
    let usernameExists = await db_utils.usernameExists(username_input);
    if (!usernameExists) {
        res.render("message", { message: "This username does not exist." });
    } else {
        // Compare passwords with the one in db
        if (await db_utils.wrongPass(username_input, password_input, res)) return;
        // Login if passwords match
        login(req, res, username_input);
    }
});

router.post("/account/change_username", async (req, res) => {
    let new_username = req.body.new_username;
    let password_input = req.body.password.toString();

    if (!req.session.loggedin) {
        res.redirect("/account/login");
    } else {
        // Compare passwords with the one in db
        if (await db_utils.wrongPass(req.session.username, password_input, res)) return;
        // Change username if passwords match
        await db_utils.changeUserName(new_username, req.session.username);
        req.session.username = new_username;
        res.redirect("/user");
    }
});

router.post("/account/change_password", async (req, res) => {
    let old_password = req.body.old_password;
    let new_password = req.body.new_password.toString();
    let confirm_new_password = req.body.confirm_new_password.toString();

    if (!req.session.loggedin) {
        res.redirect("/account/login");
    } else if (confirm_new_password != new_password) {
        res.render("message", { message: "Passwords don't match!" });
    } else {
        // Compare passwords with the one in db
        if (await db_utils.wrongPass(req.session.username, old_password, res)) return;
        // Hash the new password and put it into db
        let hashedPassword = await hashPassword(new_password);
        await db_utils.changePassword(hashedPassword, req.session.username);
        res.render("message", { message: "Password changed successfully." });
    }
});

/** User is logged in */
function login(req, res, username) {
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect("/user");
}

/** Hash the password */
async function hashPassword(pass) {
    let salt = await bcrypt.genSalt();
    return await bcrypt.hash(pass, salt);
}

module.exports = router; // this line is needed for importing, necessary for all router files