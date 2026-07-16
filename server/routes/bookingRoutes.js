import express from "express";
import {
  createBooking,
  getBookingHistory,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create Booking
router.post("/create", createBooking);

// Get Booking History
router.get("/history", getBookingHistory);

// Delete Booking
router.delete("/:id", deleteBooking);

// Update Booking Status
router.put("/:id", updateBookingStatus);

export default router;