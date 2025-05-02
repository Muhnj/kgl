const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const CreditSale = require('../models/CreditSale');
const Produce = require('../models/Produce');

router.get('/manager-dashboard', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;
  if (user.role !== 'Manager') {
    return res.status(403).send('Access denied');
  }

  try {
    const branchFilter = { branch: user.branch };

    // Parallel database queries
    const [totalProducts, totalCreditSales, lowStockItems, salesAgg, owedAgg, paidAgg] = await Promise.all([
      Produce.countDocuments(branchFilter),
      CreditSale.countDocuments(branchFilter),
      Produce.find({
        branch: user.branch,
        $expr: { $lte: ["$tonnage", "$threshold"] } // Fixed field name
      }),
      CreditSale.aggregate([
        { $match: branchFilter },
        { $group: { _id: "$branch", totalSales: { $sum: "$totalAmount" } } }
      ]),
      CreditSale.aggregate([
        { $match: { ...branchFilter, status: 'pending' } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      CreditSale.aggregate([
        { $match: { ...branchFilter, status: 'paid' } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    // Process low stock items for template
    const processedLowStock = lowStockItems.map(item => ({
      name: item.productname,
      branch: item.branch,
      quantity: item.tonnage,
      threshold: item.threshold
    }));

    // Process financial data
    const totalAmountOwed = owedAgg[0]?.total || 0;
    const totalAmountPaid = paidAgg[0]?.total || 0;

    // Process sales by branch
    const salesByBranch = salesAgg.map(branch => ({
      _id: branch._id,
      totalSales: branch.totalSales,
      formattedTotal: new Intl.NumberFormat('en-US').format(branch.totalSales),
      progress: Math.min((branch.totalSales / 50000000) * 100, 100) // Cap at 100%
    }));

    res.render('managerDashboard', {
      user,
      totalProducts,
      totalCreditSales,
      totalAmountOwedFormatted: new Intl.NumberFormat('en-US').format(totalAmountOwed),
      totalAmountPaidFormatted: new Intl.NumberFormat('en-US').format(totalAmountPaid),
      salesByBranch,
      lowStockItems: processedLowStock
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).render('error', { message: "Failed to load dashboard data" });
  }
});

module.exports = router;