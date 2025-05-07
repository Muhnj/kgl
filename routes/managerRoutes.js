const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const CreditSale = require('../models/CreditSale');
const Produce = require('../models/Produce');
const Sale = require('../models/Sale'); // Don't forget to import this
router.get('/manager-dashboard', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;
  if (user.role !== 'Manager') {
    return res.status(403).send('Access denied');
  }

  try {
    const branchFilter = { branch: user.branch };

    // Fetch all needed data in parallel
    const [
      totalProducts,
      totalCreditSales,
      lowStockItems,  // Add lowStockItems here
      salesAgg,
      owedAgg,
      paidAgg,
      allInventory,
      creditSales
    ] = await Promise.all([
      Produce.countDocuments(branchFilter),
      CreditSale.countDocuments(branchFilter),
      Produce.find({
        ...branchFilter,
        $expr: { $lte: ["$tonnage", "$threshold"] }  // Query to find low stock products
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
      ]),
      Produce.find(branchFilter),
      CreditSale.find(branchFilter).sort({ createdAt: -1 }).limit(10)
    ]);

    // Calculate totals
    const totalAmountOwed = owedAgg[0]?.total || 0;
    const totalAmountPaid = paidAgg[0]?.total || 0;

    // Format inventory for display
    const processedInventory = allInventory.map(item => {
      let value = item.sellingPrice && item.tonnage
        ? item.sellingPrice * item.tonnage
        : 0;

      let status = item.tonnage <= item.threshold
        ? (item.tonnage === 0 ? 'Critical' : 'Low')
        : 'Good';

      return {
        productname: item.productname,
        productType: item.productType,
        quantity: item.tonnage,
        value,
        status,
        image: item.image
      };
    });

    // Format activities
    const recentActivities = creditSales.map(cs => ({
      type: cs.status === 'paid' ? 'Paid Credit' : 'Pending Credit',
      description: `${cs.productname} to ${cs.buyerName}`,
      date: cs.createdAt.toLocaleString()
    }));

    // Prepare stats object
    const branchStats = {
      inventoryCount: totalProducts,
      totalSales: totalAmountPaid,
      pendingCredits: totalCreditSales
    };

    // Check if low stock items exist
    const lowStockAlert = lowStockItems.length > 0;

    // Pass data to the view
    res.render('managerDashboard', {
      user,
      branchStats,
      inventory: processedInventory,
      recentActivities,
      lowStockAlert,  // Pass the alert flag to the template
      lowStockItems   // Pass the list of low stock items to the template
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).render('error', { message: "Failed to load dashboard data" });
  }
});


router.get("/adduser", (req, res) => {
  const user = req.user;
    if (user.role !== "Manager") {
      return res.status(403).send("Access denied");
    }
  res.render("adduser");
});

module.exports = router;
