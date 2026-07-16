import express from "express";
import {
  createBooking,
  getBookingHistory,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/history", getBookingHistory);
router.post("/create", createBooking);
router.delete("/delete/:id", deleteBooking);
router.put("/update/:id", updateBookingStatus);

export default router;