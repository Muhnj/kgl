const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");

const Sale = require("../models/Sale");
const Produce = require("../models/Produce");
const CreditSale = require('../models/CreditSale');

// Routes for making a sale
router.get("/addSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;

  if (user.role !== "Manager" && user.role !== "SalesAgent") {
    return res.status(403).send("Access denied: You are not allowed to view this page.");
  }

  try {
    const produce = await Produce.findById(req.params.id);
    if (!produce) {
      return res.status(404).send("Produce not found");
    }

    const username = user.username;
    const branch = user.branch;
    const today = new Date().toISOString().split('T')[0];

    res.render("salesDash", { produce, username, branch, today });
  } catch (error) {
    console.error("Error rendering sale form:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


// POST route to handle selling a sale`
router.post("/addSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;

  if (user.role !== "Manager" && user.role !== "SalesAgent") {
    return res.status(403).send("Access denied: You are not allowed to perform this action.");
  }

  try {
    const produce = await Produce.findById(req.params.id);
    if (!produce) {
      return res.status(404).send("Produce not found");
    }

    const saletonnage = parseFloat(req.body.saletonnage);
    if (isNaN(saletonnage) || saletonnage <= 0) {
      return res.status(400).send("Invalid tonnage value.");
    }

    const { sellingPrice, buyerName, buyerContact, branch, agentName, saleDate } = req.body;
    if (!sellingPrice || !buyerName || !buyerContact || !branch || !agentName || !saleDate) {
      return res.status(400).send("Missing required fields.");
    }

    if (produce.tonnage < saletonnage) {
      return res.status(400).send(`Not enough tonnage in stock. Only ${produce.tonnage}kg available.`);
    }

    const saleMade = new Sale({
      productname: produce._id,
      saletonnage,
      sellingPrice,
      buyerName,
      buyerContact,
      branch,
      agentName,
      saleDate,
    });

    await saleMade.save();

    produce.tonnage -= saletonnage;
    await produce.save();

    res.redirect("/salesList");
  } catch (error) {
    console.error("Error processing sale:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Get all sales
router.get(
  "/salesList",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const userBranch = req.user.branch;
      const username = req.user.username;

      let items = await Sale.find()
        .sort({ $natural: -1 })
        .populate("productname"); // Still OK if productname is a ref to Produce

      // Filter sales based on logged-in user's branch and name
      const filteredSales = items.filter(
        (sale) =>
          sale.branch === userBranch &&
          sale.agentName === username
      );

      console.log(`Filtered sales for ${username} at ${userBranch}:`, filteredSales);

      res.render("list_sales", {
        title: "Sales list",
        sales: filteredSales,
      });
    } catch (err) {
      console.error(err);
      res.status(400).send("Unable to find items in the database");
    }
  }
);


//   this where a sales agent can make a sale
router.get("/makesale", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const items = await Produce.find({ branch: req.user.branch })
                         .sort({ createdAt: -1 }); // Proper sorting

    res.render("salesproducedata", {
      produces: items,
      formatNumber: (num) => num?.toLocaleString() || "0" // Helper for formatting
    });
  } catch (error) {
    console.error("List produces error:", error);
    res.status(400).render("error", { message: "Failed to load produce list" });
  }
});
router.get("/print-sale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('productname');
    
    if (!sale) {
      return res.status(404).render("error", { message: "Sale record not found" });
    }

    res.render("print-sale", { sale, user: req.user });
  } catch (error) {
    console.error("Print sale receipt error:", error);
    res.status(500).render("error", { message: "Failed to generate sale receipt" });
  }
});
// DELETE /sales/:id
router.post('/sales/delete/:id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;

  if (user.role !== "Manager") {
    return res.status(403).send("Access denied: You are not allowed to perform this action.");
  }

  try {
    const saleId = req.params.id;
    
    const deletedSale = await Sale.findByIdAndDelete(saleId);
    
    if (!deletedSale) {
      return res.status(404).render('error', { message: 'Sale not found' });
    }

    res.redirect('/salesList');
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).render('error', { message: 'Failed to delete sale' });
  }
});
router.get('/sales/edit/:id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('productname');
    if (!sale) {
      return res.status(404).render('error', { message: 'Sale not found' });
    }

    res.render('edit_sale', {
      title: 'Edit Sale',
      sale
    });
  } catch (err) {
    console.error("Edit GET error:", err);
    res.status(500).render("error", { message: "Failed to load sale for editing" });
  }
});router.post('/sales/edit/:id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const { saletonnage, sellingPrice, buyerName, buyerContact } = req.body;

    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      {
        saletonnage,
        sellingPrice,
        buyerName,
        buyerContact
      },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).render('error', { message: 'Sale not found for update' });
    }

    res.redirect('/salesList');
  } catch (err) {
    console.error("Edit POST error:", err);
    res.status(500).render("error", { message: "Failed to update sale" });
  }
});


// router.get("/makesale", async (req, res) => {
//   try {
//     const items = await Produce.find().sort({ $natural: -1 });
//     res.render("salesproducedata", {
//       produces: items,
//     });
//   } catch (error) {
//     res.status(400).send("unable to find items in the db");
//   }
// });
// Route to display the credit sale page with available products
// Route to list all products available for credit sales


// Route to list all products available for credit sales
router.get("/creditsale", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;

  if (user.role !== "Manager" && user.role !== "SalesAgent") {
    return res.status(403).send("Forbidden: Access allowed only for Manager or SalesAgent");
  }

  try {
    const produces = await Produce.find().sort({ createdAt: -1 });
    res.render("creditsale", { produces });
  } catch (error) {
    console.error("Error fetching produce list:", error);
    res.status(500).send("Unable to fetch produce items");
  }
});

// Route to show the credit sale form for a specific product
router.get("/addCreditSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;

  if (user.role !== "Manager" && user.role !== "SalesAgent") {
    return res.status(403).send("Forbidden: Access allowed only for Manager or SalesAgent");
  }

  try {
    const produce = await Produce.findById(req.params.id);
    if (!produce) return res.status(404).send("Produce not found");

    const today = new Date().toISOString().split("T")[0];
    const username = user.username || "DefaultAgent";
    const branch = user.branch || "MainBranch";

    res.render("addCreditSale", {
      produce,
      today,
      username,
      branch,
    });
  } catch (error) {
    console.error("Error loading credit sale form:", error);
    res.status(500).send("Failed to load credit sale form");
  }
});

// Route to submit the credit sale form
router.post("/addCreditSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;

  if (user.role !== "Manager" && user.role !== "SalesAgent") {
    return res.status(403).send("Forbidden: Access allowed only for Manager or SalesAgent");
  }

  try {
    const {
      productname,
      saletonnage,
      saleDate,
      saleTime,
      totalAmount,
      buyerName,
      buyerContact,
      location,
      nationalId,
      dueDate,
      dispatchDate,
      branch,
      agentName,
    } = req.body;

    // 1. Save credit sale
    const creditSale = new CreditSale({
      productId: req.params.id,
      productname,
      saletonnage,
      saleDate,
      saleTime,
      totalAmount,
      buyerName,
      buyerContact,
      location,
      nationalId,
      dueDate,
      dispatchDate,
      branch,
      agentName,
    });

    await creditSale.save();

    // 2. Reduce the tonnage from the produce
    const produce = await Produce.findById(req.params.id);
    if (!produce) return res.status(404).send("Produce not found");

    // Make sure saletonnage is a number
    const saleTons = parseFloat(saletonnage);
    if (produce.tonnage < saleTons) {
      return res.status(400).send("Not enough stock to complete the sale");
    }

    produce.tonnage -= saleTons;
    await produce.save();

    res.redirect("/credit-sales");

  } catch (error) {
    console.error("Error saving credit sale:", error);
    res.status(500).send("Failed to record credit sale");
  }
});


// Route to list all credit sales
router.get('/credit-sales', async (req, res) => {
  try {
    const creditSales = await CreditSale.find().sort({ saleDate: -1 });
    res.render('creditSalesList', { creditSales: creditSales || [] }); // Render credit sales or empty array if none
  } catch (err) {
    console.error("Error fetching credit sales:", err);
    res.status(500).send("Unable to load credit sales");
  }
});

// Route to mark a credit sale as paid
router.post('/credit-sales/:id/mark-paid', async (req, res) => {
  try {
    // Step 1: Update the credit sale status
    const creditSale = await CreditSale.findByIdAndUpdate(
      req.params.id,
      { status: 'paid' },
      { new: true }
    );

    if (!creditSale) {
      return res.status(404).send('Credit sale not found');
    }

    // Step 2: Update the related sale (if exists)
    if (creditSale.saleId) {
      await Sale.findByIdAndUpdate(
        creditSale.saleId,
        { isPaid: true }, // or e.g. paymentStatus: 'paid'
        { new: true }
      );
    }

    res.redirect('/credit-sales');
  } catch (err) {
    console.error('Error marking as paid:', err);
    res.status(500).send('Failed to update sale status');
  }
});


module.exports = router;