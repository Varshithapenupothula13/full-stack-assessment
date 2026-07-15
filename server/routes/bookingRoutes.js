import express from "express";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Create a new booking
router.post("/create", createBooking);

export default router;