const express = require("express");
const router = express.Router();

router.get("/prof", (req, res) => {
  res.render("profileupdate");
});

module.exports = router;