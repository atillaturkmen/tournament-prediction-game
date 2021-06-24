const express = require("./imports").express;

const router = express.Router();

// Render home page ejs for root page
router.get("/", (req, res) => {
    res.render("home");
});

// Handle these routes in relevant js files
const user = require("./user");
router.get("/user/*", user);
router.post("/user/*", user);

const euro2020 = require("./euro2020");
router.get("/euro2020", euro2020);
router.post("/euro2020", euro2020);

const tahmin_et = require("./tahmin-et");
router.get("/tahmin-et", tahmin_et);
router.post("/tahmin-et", tahmin_et);

// Make this js module available for import (at index.js in the root)
module.exports = router;