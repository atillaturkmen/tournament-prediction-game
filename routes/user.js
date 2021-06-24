// These two have to be in all router files
const express = require("./imports").express;
const router = express.Router();

router.get("/user/:username", (req, res) => {
    let username = req.params.username; // parameter after user can be used like this
    res.send("TODO");
});

module.exports = router; // this line is needed for importing, necessary for all router files