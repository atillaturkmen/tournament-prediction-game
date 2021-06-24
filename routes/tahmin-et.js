// These two have to be in all router files
const express = require("./imports").express;
const router = express.Router();

router.get("/tahmin-et", (req, res) => {
    res.send("TODO");
});

module.exports = router; // this line is needed for importing, necessary for all router files