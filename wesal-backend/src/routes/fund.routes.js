const router = require("express").Router();
const Fund = require("../models/Fund");
const auth = require("../middleware/auth.middleware");

router.get("/", auth(["Admin", "Owner", "Viewer"]), async (req, res) => {
  try {
    const funds = await Fund.find().sort({ createdAt: -1 });
    const total = funds.reduce((sum, item) => sum + item.amount, 0);
    res.json({ funds, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth(["Admin", "Owner"]), async (req, res) => {
  try {
    const { category, amount } = req.body;
    const newFund = await Fund.create({ category, amount });
    res.status(201).json(newFund);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", auth(["Admin", "Owner"]), async (req, res) => {
  try {
    await Fund.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth(["Admin", "Owner"]), async (req, res) => {
  try {
    const { amount } = req.body;
    const updatedFund = await Fund.findByIdAndUpdate(
      req.params.id, 
      { amount },
      { new: true }
    );
    res.json(updatedFund);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;