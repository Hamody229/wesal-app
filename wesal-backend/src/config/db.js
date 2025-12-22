const mongoose = require("mongoose");

let isConnected = false; 

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
    });

    isConnected = db.connections[0].readyState;
    console.log("=> New database connection established");
  } catch (error) {
    console.error("=> Database connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;