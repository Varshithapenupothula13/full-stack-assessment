import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Environment variables configurations load avthayi
dotenv.config();

const app = express();

// Middlewares setup
app.use(cors());
app.use(express.json());

// Database connection logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected Safely: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1); // Error vasthe server clean ga close avthundi
  }
};

// Database connect chesthunnam
connectDB();

// Root route checking ki
app.get("/", (req, res) => {
  res.send("Server is running smoothly...");
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});