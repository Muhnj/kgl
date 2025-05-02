const express = require("express");
const router = express.Router();

router.get("/salesdash", (req, res) => {
  res.render("salesDash");
});

module.exports = router;