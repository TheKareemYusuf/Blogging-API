const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DATABASE_URL = process.env.DATABASE_URL;

// function to handle database connection
function connetToMongoDB() {
  mongoose.connect(DATABASE_URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
  });
}

module.exports = { connetToMongoDB };
