const router = require("express").Router();
const Merchant = require("../models/Merchant");
const AuditLog = require("../models/AuditLog"); 
const auth = require("../middleware/auth.middleware");

router.get("/", auth(), async (req, res) => {
  const merchants = await Merchant.find();
  res.json(merchants);
});

router.post("/", auth(["Admin" , "Owner"]), async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Merchant.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: "This merchant already exists!" });
    }

    const merchant = await Merchant.create(req.body);
    res.json(merchant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth(["Admin" , "Owner"]), async (req, res) => {
  try {
    const updated = await Merchant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (updated) {
      await AuditLog.create({
        action: 'UPDATE',
        entity: 'Merchant',
        entityId: updated._id,
        details: `Updated merchant info: ${updated.name}`,
        performedBy: {
          name: req.user.name || "Admin",
          role: req.user.role || "Admin"
        }
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete merchant
router.delete("/:id", auth(["Admin" , "Owner"]), async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (merchant) {
      await Merchant.findByIdAndDelete(req.params.id);

      await AuditLog.create({
        action: 'DELETE',
        entity: 'Merchant',
        entityId: req.params.id,
        details: `Deleted merchant: ${merchant.name}`,
        performedBy: {
          name: req.user.name || "Admin",
          role: req.user.role || "Admin"
        }
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;