require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/analysis", require("./routes/analysis.routes"));
app.use("/api/merchants", require("./routes/merchant.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/funds", require("./routes/fund.routes"));
app.use('/api/audit', require('./routes/audit.routes'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
