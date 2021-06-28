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

router.get("/account/change_username", async (req, res) => {
    if (req.session.loggedin) {
        res.render("change_username");
    } else {
        res.redirect("/account/login");
    }
});

router.get("/account/change_password", async (req, res) => {
    if (req.session.loggedin) {
        res.render("change_password");
    } else {
        res.redirect("/account/login");
    }
});

// Creates user
router.post("/account/signup", async (req, res) => {
    let username_input = req.body.username;
    let password_input = req.body.password;
    // Check the db if username exists
    let usernameExists = await db_utils.usernameExists(username_input);
    if (usernameExists) {
        res.render("message", {
            message: "This username is taken, try again.",
        });
    } else {
        // Hash the password
        let salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(password_input, salt);
        // Create and login
        await db_utils.createUser(username_input, hashedPassword);
        req.session.loggedin = true;
        req.session.username = username_input;
        res.redirect("/user");
    }
});

// Handles login
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

router.post("/account/change_username", async (req, res) => {
    let new_username = req.body.new_username;
    let password_input = req.body.password;

    if (!req.session.loggedin) {
        res.redirect("/account/login");
    } else {
        // Compare passwords with the one in db
        let password = await db_utils.getPassword(req.session.username);
        let pass_check = await bcrypt.compare(password_input, password);
        if (!pass_check) {
            res.render("message", {
                message: "Wrong password",
            });
        } else {
            await db_utils.changeUserName(new_username, req.session.username);
            req.session.username = new_username;
            res.redirect("/user");
        }
    }
});

router.post("/account/change_password", async (req, res) => {
    let old_password = req.body.old_password;
    let new_password = req.body.new_password;
    let confirm_new_password = req.body.confirm_new_password;

    if (!req.session.loggedin) {
        res.redirect("/account/login");
    } else if (confirm_new_password != new_password) {
        res.render("message", {
            message: "Passwords don't match!",
        });
    } else {
        // Compare passwords with the one in db
        let password = await db_utils.getPassword(req.session.username);
        let pass_check = await bcrypt.compare(old_password, password);
        if (!pass_check) {
            res.render("message", {
                message: "Wrong password",
            });
        } else {
            // Hash the password
            let salt = await bcrypt.genSalt();
            let hashedPassword = await bcrypt.hash(new_password, salt);
            await db_utils.changePassword(hashedPassword, req.session.username);
            res.render("message", {
                message: "Password changed successfully.",
            });
        }
    }
});

module.exports = router; // this line is needed for importing, necessary for all router files