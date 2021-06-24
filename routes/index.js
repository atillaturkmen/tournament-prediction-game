const express = require("./imports").express;

const router = express.Router();

// Send this string for root page
router.get("/", (req, res) => {
    res.render("home");
});

// Make this js module available for import (at index.js in the root)
module.exports = router;