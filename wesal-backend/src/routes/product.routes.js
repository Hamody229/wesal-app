const router = require("express").Router();
const Product = require("../models/Product");
const AuditLog = require("../models/AuditLog"); 
const auth = require("../middleware/auth.middleware");

router.get("/", auth(), async (req, res) => {
  const products = await Product.find().populate("merchant");
  res.json(products);
});

router.post("/", auth(["Admin" , "Owner"]), async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      merchant: req.body.merchantId,
    });

    const populated = await product.populate("merchant");

    await AuditLog.create({
      action: 'CREATE',
      entity: 'Product',
      entityId: product._id,
      details: `Added new product: ${product.name} (${product.quantity}kg)`,
      performedBy: {
        name: req.user.name || "Admin", 
        role: req.user.role || "Admin"
      }
    });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE product 
router.put("/:id", auth(["Admin" , "Owner"]), async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        merchant: req.body.merchantId,
      },
      { new: true }
    ).populate("merchant");

    if (updated) {
      await AuditLog.create({
        action: 'UPDATE',
        entity: 'Product',
        entityId: updated._id,
        details: `Updated product details: ${updated.name}`,
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

// DELETE product
router.delete("/:id", auth(["Admin" , "Owner"]), async (req, res) => {
  try {
    const productToDelete = await Product.findById(req.params.id);
    
    if (productToDelete) {
      await Product.findByIdAndDelete(req.params.id);

      await AuditLog.create({
        action: 'DELETE',
        entity: 'Product',
        entityId: req.params.id,
        details: `Deleted product: ${productToDelete.name}`,
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