const mongoose = require('mongoose');

const creditSaleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produce',
    required: true,
  },
  productname: String,
  saletonnage: Number,
  saleDate: Date,
  saleTime: String,
  totalAmount: Number,
  sellingPrice: Number,

  buyerName: String,
  buyerContact: String,
  location: String,
  nationalId: String,

  dueDate: Date,
  dispatchDate: Date,

  branch: String,
  agentName: String,

  status: {
    type: String,
    default: 'pending', // Can be 'pending', 'paid', 'overdue'
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('CreditSale', creditSaleSchema);
