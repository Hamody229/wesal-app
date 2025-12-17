const router = require("express").Router();
const Product = require("../models/Product");
const Merchant = require("../models/Merchant");
const auth = require("../middleware/auth.middleware");

router.get("/", auth(), async (req, res) => {
  const products = await Product.find();
  const merchants = await Merchant.find();

  const totalProducts = products.length;
  const totalMerchants = merchants.length;

  const categories = [
    ...new Set(products.map((p) => p.category)),
  ];

  const totalCost = products.reduce(
    (sum, p) => sum + p.price,
    0
  );

  const costPerCategory = {};
  products.forEach((p) => {
    costPerCategory[p.category] =
      (costPerCategory[p.category] || 0) + p.price;
  });

  res.json({
    totalProducts,
    totalMerchants,
    totalCategories: categories.length,
    totalCost,
    costPerCategory,
  });
});

module.exports = router;
