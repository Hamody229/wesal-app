const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.middleware");

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log("USER FOUND:", user ? user.email : null);

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      role: user.role,
      name: user.name
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

/* ===================== GET ALL USERS ===================== */
router.get("/users", auth(["Owner", "Admin"]), async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ name: 1 });

    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===================== CREATE USER ===================== */
router.post("/create-user", auth(["Owner", "Admin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Viewer"
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===================== GET ME ===================== */
router.get("/me", auth(), async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===================== DELETE USER ===================== */
router.delete("/users/:id", auth(["Owner"]), async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete yourself"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===================== UPDATE PROFILE ===================== */
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
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
