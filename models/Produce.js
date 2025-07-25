const mongoose = require("mongoose");

const ProduceSchema = new mongoose.Schema({
  productname: { type: String, required: true },
  productType: { type: String, required: true },
  entryDate: { type: Date, required: true },
  tonnage: { type: Number, required: true },
  cost: { type: Number },
  sellingPrice: { type: Number },
  dealerName: String,
  dealerContact: String,
  branch: { type: String, required: true },
  image: String,
  notes: String,
  threshold: { type: Number, default: 100 }, // NEW
  status: {
    type: String,
    enum: ["Normal", "Low", "Critical"],
    default: "Normal"
  } // NEW
});

module.exports = mongoose.model("Produce", ProduceSchema);
