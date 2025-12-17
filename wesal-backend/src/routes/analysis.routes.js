const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth.middleware");

router.get("/category/:category", auth(), async (req, res) => {
  const { category } = req.params;

  const products = await Product.find({ category })
    .populate("merchant", "name");
  if (!products.length) {
    return res.json({
      category,
      min: null,
      max: null,
      bestValue: null,
    });
  }

  const min = products.reduce((a, b) =>
    a.price < b.price ? a : b
  );

  const max = products.reduce((a, b) =>
    a.price > b.price ? a : b
  );

  const bestValue = products.reduce((a, b) =>
    a.price / a.quantity < b.price / b.quantity ? a : b
  );

  res.json({
    category,
    min,
    max,
    bestValue,
  });
});

module.exports = router;
