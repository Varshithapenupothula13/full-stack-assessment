import Booking from "../models/Booking.js";
import { razorpay } from "../index.js";

export const createBooking = async (req, res) => {
  try {
    const { pickup, drop, rideType } = req.body;

    const distance = Math.floor(Math.random() * 15) + 3;
    const fare = 50 + distance * 15;
    const duration = `${distance * 4} mins`;

    const options = {
      amount: fare * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const booking = new Booking({
      pickup,
      drop,
      rideType,
      distance,
      fare,
      duration,
      status: "Pending",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      booking,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

export const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Completed";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};