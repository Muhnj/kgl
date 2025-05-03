const express = require("express");
const router = express.Router();

router.get("/salesdash", (req, res) => {
  res.render("salesDash");
});
router.get("/procurement", (req, res) => {
  res.render("salesprocurement");
});


module.exports = router;