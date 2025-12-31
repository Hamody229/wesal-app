const express = require("express");
const cors = require("cors");
const connectDB = require("../src/config/db");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.use("/auth", require("../src/routes/auth.routes"));

// Test route
app.get("/", (req, res) => {
  res.send("Wesal API is running 🚀");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
