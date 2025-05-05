const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const multer = require("multer");
const Produce = require("../models/Produce");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Adding timestamp for unique filenames
  },
});
const upload = multer({ storage });

// Add new produce
router.get("/addition", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render("addition", {
    branch: req.user.branch,
    username: req.user.username  // Add this line
  });
});


router.post("/addition", connectEnsureLogin.ensureLoggedIn(), upload.single("image"), async (req, res) => {
  try {
    const produceData = {
      ...req.body,
      branch: req.user.branch, // Ensure branch is set from user session
      image: req.file?.path || "" // Handle optional image
    };

    // Convert numerical fields to numbers
    produceData.tonnage = Number(produceData.tonnage);
    produceData.threshold = Number(produceData.threshold);
    produceData.cost = Number(produceData.cost);
    produceData.sellingPrice = Number(produceData.sellingPrice);

    const produce = new Produce(produceData);
    await produce.save();
    res.redirect("/Produceslist");
  } catch (error) {
    console.error("Add produce error:", error);
    res.status(400).render("addition", { error: "Failed to add produce item" });
  }
});

// List produces
router.get("/Produceslist", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const items = await Produce.find({ branch: req.user.branch })
                         .sort({ createdAt: -1 }); // Proper sorting

    res.render("producedata", {
      produces: items,
      formatNumber: (num) => num?.toLocaleString() || "0" // Helper for formatting
    });
  } catch (error) {
    console.error("List produces error:", error);
    res.status(400).render("error", { message: "Failed to load produce list" });
  }
});

// Update produce
router.get("/updateproduce/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const produce = await Produce.findOne({
      _id: req.params.id,
      branch: req.user.branch // Ensure the logged-in user only accesses their branch
    });

    if (!produce) {
      return res.status(404).render("error", { message: "Produce not found" });
    }

    // Pass user info to the template
    res.render("updateproduce", {
      produce,
      branch: req.user.branch,
      username: req.user.username
    });
  } catch (error) {
    console.error("Get update error:", error);
    res.status(400).render("error", { message: "Failed to load update page" });
  }
});

router.post("/updateproduce/:id", connectEnsureLogin.ensureLoggedIn(), upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      tonnage: Number(req.body.tonnage),
      threshold: Number(req.body.threshold),
      image: req.file?.path || req.body.oldImage // Handle image update
    };

    // Validate branch ownership
    const updated = await Produce.findOneAndUpdate(
      { _id: req.params.id, branch: req.user.branch },
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).render("error", { message: "Produce not found" });

    res.redirect("/Produceslist");
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).render("error", { message: "Failed to update produce" });
  }
});

// Delete produce
router.post("/deleteProduce", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const result = await Produce.deleteOne({
      _id: req.body.id,
      branch: req.user.branch // Ensure branch match
    });

    if (result.deletedCount === 0) {
      return res.status(404).render("error", { message: "Produce not found" });
    }

    res.redirect("/Produceslist");
  } catch (error) {
    console.error("Delete error:", error);
    res.status(400).render("error", { message: "Failed to delete produce" });
  }
});

module.exports = router;