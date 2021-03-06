const express = require("express"); // import express
const path = require("path");

const router = express.Router();

const db_utils = require("../db/db-utils");

// Render home page ejs for root page
router.get("/", async (req, res) => {
    let topTen = await db_utils.getTopTen(); // you can wait for data from db like so
    res.render("home", {
        topTen: topTen, // and send it to ejs like this
    });
});

// Handle these routes in relevant js files
const user = require("./user");
router.get("/user", user);
router.post("/user", user);
router.get("/user/*", user);
router.post("/user/*", user);

const tahmin_et = require("./tahmin-et");
router.get("/tahmin-et", tahmin_et);
router.post("/tahmin-et", tahmin_et);
router.get("/tahmin-et/*", tahmin_et);
router.post("/tahmin-et/*", tahmin_et);

const account = require("./account");
router.get("/account/*", account);
router.post("/account/*", account);

const admin = require("./admin");
router.get("/admin", admin);
router.post("/admin", admin);
router.get("/admin/*", admin);
router.post("/admin/*", admin);

// Serve thumbnail icon
router.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(__dirname, "/../public/icon/favicon.ico"));
});

// Make this js module available for import (at index.js in the root)
module.exports = router;