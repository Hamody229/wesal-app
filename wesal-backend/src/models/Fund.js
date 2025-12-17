const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true, 
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fund", fundSchema);
