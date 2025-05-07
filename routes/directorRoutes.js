const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const CreditSale = require("../models/CreditSale");
const User = require("../models/Signup"); // <- This is the model you're using

// Director's dashboard route
router.get(
  "/directorDash",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const user = req.user;
    if (user.role !== "Director") {
      return res.status(403).send("Access denied");
    }

    try {
      const totalRevenue = await CreditSale.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: null,
            totalsale: { $sum: "$totalAmount" },
            totalquantitysold: { $sum: "$quantity" },
          },
        },
      ]);

      const creditSales = await CreditSale.aggregate([
        { $match: { status: "pending" } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
            totalQuantity: { $sum: "$quantity" },
          },
        },
      ]);

      const branchSales = await CreditSale.aggregate([
        {
          $group: {
            _id: "$branch",
            totalAmount: { $sum: "$totalAmount" },
            totalQuantity: { $sum: "$quantity" },
          },
        },
      ]);

      res.render("directordash", {
        totalRevenue: totalRevenue[0] || { totalsale: 0, totalquantitysold: 0 },
        creditSales: creditSales[0] || { totalAmount: 0, totalQuantity: 0 },
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


// router.get('/userlist', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
//   const user = req.user;
//   if (user.role !== 'Director') return res.status(403).send('Access denied');

//   try {
//     const users = await User.find({});
//     res.render('userlist', { users });
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

module.exports = router;
