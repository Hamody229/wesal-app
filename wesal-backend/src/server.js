require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
    origin: "*", 
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/analysis", require("./routes/analysis.routes"));
app.use("/api/merchants", require("./routes/merchant.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/funds", require("./routes/fund.routes"));
app.use('/api/audit', require('./routes/audit.routes'));

app.get("/", (req, res) => {
    res.send("Wesal Server is Running on Fly.io!");
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message); 
  res.status(500).json({ 
    message: "Internal Server Error", 
    error: err.message 
  });
});

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

connectDB(); 

app.get("/", (req, res) => {
    res.send("Wesal Server is Running on Vercel!");
});


module.exports = app;