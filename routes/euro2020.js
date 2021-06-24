// These two have to be in all router files
const express = require("./imports").express;
const router = express.Router();

router.get("/euro2020", (req, res) => {
    res.send("TODO");
});

module.exports = router; // this line is needed for importing, necessary for all router files