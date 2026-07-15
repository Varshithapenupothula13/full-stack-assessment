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
    distance: {
      type: Number,
      default: 0,
    },
    fare: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: "",
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