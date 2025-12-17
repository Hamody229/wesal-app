require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedOwner() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "owner@wesal.com";
  const plainPassword = "123456"; 

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("⚠️ Owner account already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await User.create({
    name: "System Owner",
    email,
    password: hashedPassword,
    role: "Owner", 
  });

  console.log("✅ Owner user created successfully!");
  console.log("Email: owner@wesal.com");
  console.log("Password: 123456");
  process.exit(0);
}

seedOwner();