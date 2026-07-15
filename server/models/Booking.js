import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    pickup: {
      type: String,
      required: true,
    },
    drop: {
      type: String,
      required: true,
    },
    rideType: {
      type: String,
      enum: ["Bike", "Auto", "Car"],
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;