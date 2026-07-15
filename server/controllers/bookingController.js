import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { pickup, drop, rideType } = req.body;

    const booking = new Booking({
      pickup,
      drop,
      rideType,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};