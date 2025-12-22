const mongoose = require("mongoose");

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    console.log("=> Using existing database connection");
    return cachedDb;
  }

  console.log("=> Creating new database connection");
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
    });

    cachedDb = db;
    return db;
  } catch (error) {
    console.error("=> Database connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;