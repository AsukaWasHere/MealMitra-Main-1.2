import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    quantity: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    lat: { type: Number }, // Added
    lng: { type: Number }, // Added
    price: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true },
    quality: { type: String, enum: ["Best Quality", "Good Quality", "Not Consumable"], default: "Good Quality" },
    verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["available", "claimed"],
      default: "available",
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;