import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    unitId: { type: String, required: true, unique: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [72.8777, 19.076],
      },
    },
    status: {
      type: String,
      enum: ["available", "dispatched", "unavailable"],
      default: "available",
      index: true,
    },
    activeEmergencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
      default: null,
    },
  },
  { timestamps: true }
);

ambulanceSchema.index({ currentLocation: "2dsphere" });
ambulanceSchema.index({ status: 1, currentLocation: "2dsphere" });

export const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
