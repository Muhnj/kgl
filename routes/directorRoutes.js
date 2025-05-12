const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const Sale = require("../models/Sale");
const User = require('../models/Signup');


router.get(
  "/directorDash",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const user = req.user;

    if (user.role !== "Director") {
      return res.status(403).send("Access denied");
    }

    try {
      // 1. Total Revenue & Quantity Sold
      const revenueData = await Sale.aggregate([
        {
          $group: {
            _id: null,
            totalsale: { $sum: { $multiply: ["$saletonnage", "$sellingPrice"] } },
            totalquantitysold: { $sum: "$saletonnage" },
          },
        },
      ]);

      // 2. Branch-wise Aggregation
      const branchSales = await Sale.aggregate([
        {
          $group: {
            _id: "$branch",
            totalAmount: { $sum: { $multiply: ["$saletonnage", "$sellingPrice"] } },
            totalQuantity: { $sum: "$saletonnage" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { totalAmount: -1 } },
      ]);

      // Placeholder for credit-like info (if later added)
      const creditSales = {
        totalAmount: 0,
        totalQuantity: 0,
      };

      res.render("directordash", {
        totalRevenue: revenueData[0] || { totalsale: 0, totalquantitysold: 0 },
        creditSales,
        branchSales,
      });

    } catch (err) {
      console.error("Error loading director dashboard:", err);
      res.status(500).send("Failed to load dashboard");
    }
  }
);

router.get(
  "/overview",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const user = req.user;
    if (user.role !== "Director") {
      return res.status(403).send("Access denied");
    }

    try {
      const branchStats = await CreditSale.aggregate([
        {
          $group: {
            _id: "$branch",
            totalSales: { $sum: "$totalAmount" },
            totalQuantity: { $sum: "$quantity" },
            orders: { $sum: 1 },
          },
        },
      ]);

      const formattedStats = branchStats.map((stat) => ({
        name: stat._id,
        totalSales: stat.totalSales,
        totalQuantity: stat.totalQuantity,
        orders: stat.orders,
      }));

      res.render("overview", { branchStats: formattedStats });
    } catch (err) {
      console.error("Error loading overview:", err);
      res.status(500).send("Failed to load overview");
    }
  }
);

router.get("/additionuser", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const user = req.user;
  if (user.role !== "Director") {
    return res.status(403).send("Access denied");
  }
  res.render("admin");
});

router.get(
  "/signups/edit/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const user = req.user;
    if (user.role !== "Director") {
      return res.status(403).send("Access denied");
    }

    try {
      const editUser = await User.findById(req.params.id);
      if (!editUser) return res.status(404).send("User not found");
      res.render("editUser", { user: editUser });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/signups/edit/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const currentUser = req.user;
    if (currentUser.role !== "Director") {
      return res.status(403).send("Access denied");
    }

    const { username, email, role } = req.body;

    try {
      await User.findByIdAndUpdate(req.params.id, { username, email, role });
      res.redirect("/userlist");
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/signups/delete/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const user = req.user;
    if (user.role !== "Director") {
      return res.status(403).send("Access denied");
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/userlist");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Server error");
    }
  }
);



module.exports = router;
