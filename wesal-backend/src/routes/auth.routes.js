const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.middleware"); 

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users", auth(["Owner", "Admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create-user", auth(["Owner", "Admin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Viewer", 
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", auth(), async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:id", auth(["Owner"]), async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return res.status(404).json({ message: "User not found" });

    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", auth(), async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;