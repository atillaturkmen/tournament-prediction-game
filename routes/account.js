// These two have to be in all router files
const express = require("express"); // import express
const bcrypt = require("bcrypt"); // used for hashing passwords
const router = express.Router();

let db_utils = require("../db/db-utils"); // you can import our database utility functions like so

router.get("/account/login", async (req, res) => {
    // Redirect to user page if user is loggedin
    if (req.session.loggedin) {
        res.redirect("/user");
    } else {
        res.render("login");
    }
});

router.get("/account/register", async (req, res) => {
    // Redirect to user page if user is loggedin
    if (req.session.loggedin) {
        res.redirect("/user");
    } else {
        res.render("register");
    }
});

router.get("/account/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

router.post("/account/signup", async (req, res) => {
    let username_input = req.body.username;
    let password_input = req.body.password;
    // Hash the password
    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(password_input, salt);
    // Check the db if username exists
    let usernameExists = await db_utils.usernameExists(username_input);
    if (usernameExists) {
        res.render("message", {
            message: "This username is taken, try again.",
        });
    } else {
        await db_utils.createUser(username_input, hashedPassword);
        req.session.loggedin = true;
        req.session.username = username_input;
        res.redirect("/user");
    }
});

router.post("/account/auth", async (req, res) => {
    let username_input = req.body.username;
    let password_input = req.body.password;

    // Check the db if username exists
    let usernameExists = await db_utils.usernameExists(username_input);
    if (!usernameExists) {
        res.render("message", {
            message: "This username does not exist.",
        });
    } else {
        // Compare passwords with the one in db
        let password = await db_utils.getPassword(username_input);
        let pass_check = await bcrypt.compare(password_input, password);
        if (pass_check) {
            req.session.loggedin = true;
            req.session.username = username_input;
            res.redirect("/user");
        } else {
            res.render("message", {
                message: "Wrong password!",
            });
        }
    }
});

module.exports = router; // this line is needed for importing, necessary for all router files