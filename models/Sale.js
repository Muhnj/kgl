const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    productname: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Produce"        
    },
    saletonnage: {
        type: Number,
        required: true,
    },
    saleDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    buyerName: {
        type: String,
        required: true,
        trim: true,
    },
    buyerContact: {
        type: String,
        required: true,
        trim: true,
    },
    branch: {
        type: String,
        required: true,
    },
    agentName: {
        type: String,
        required: true,
        trim: true,
    }
}); 

module.exports = mongoose.model('Sale', SaleSchema);
