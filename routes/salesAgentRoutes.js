const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Produce = require('../models/Produce');

// Helper to get today's start and end timestamps
function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Middleware: Ensure agent is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/agent-dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const { branch, username } = req.user; // Assuming req.user contains agent info
    const { start, end } = getTodayRange();

    // Get sales made today by the agent in this branch
    const sales = await Sale.find({
      branch,
      agentName: username,
      saleDate: { $gte: start, $lte: end }
    });

    // Aggregate totals
    const dailyTonnage = sales.reduce((sum, s) => sum + s.saletonnage, 0);
    const dailyTotal = sales.reduce((sum, s) => sum + (s.saletonnage * s.sellingPrice), 0);
    const dailyCount = sales.length;

    // Get available produce in agent's branch
    const produces = await Produce.find({ branch });

    res.render('agentdashboard', {
      agent: req.user,
      sales,
      produces,
      dailyTonnage,
      dailyTotal,
      dailyCount,
      title: "Sales Agent Dashboard"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




router.get("/salesdash", (req, res) => {
  res.render("salesDash");
});



module.exports = router;