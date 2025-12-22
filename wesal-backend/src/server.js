require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("FULL ERROR DETAILS:", err);
  res.status(err.status || 500).json({ 
    message: err.message || "Internal Server Error" 
  });
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/analysis", require("./routes/analysis.routes"));
app.use("/api/merchants", require("./routes/merchant.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/funds", require("./routes/fund.routes"));
app.use('/api/audit', require('./routes/audit.routes'));

app.get("/", (req, res) => {
    res.send("Wesal Server is Running on Vercel!");
});

module.exports = app; 