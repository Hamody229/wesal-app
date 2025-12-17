const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    googleMapsLink: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Merchant", merchantSchema);
