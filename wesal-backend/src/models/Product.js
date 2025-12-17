const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    quantity: Number,

    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
