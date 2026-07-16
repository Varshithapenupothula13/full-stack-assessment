import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { pickup, drop, rideType } = req.body;

    const distance = Math.floor(Math.random() * 15) + 3;
    const fare = 50 + distance * 15;
    const duration = `${distance * 4} mins`;

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

export const