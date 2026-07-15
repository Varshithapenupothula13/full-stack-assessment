import express from "express";
import {
  createBooking,
  getBookingHistory,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/history", getBookingHistory);

export default router;