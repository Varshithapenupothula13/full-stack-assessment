import express from "express";
import {
  createBooking,
  getBookingHistory,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/history", getBookingHistory);
router.delete("/:id", deleteBooking);

export default router;