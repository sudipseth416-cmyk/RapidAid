import mongoose from "mongoose";

const resourcesSchema = new mongoose.Schema(
  {
    icuBeds: { type: Number, default: 0 },
    icuBedsTotal: { type: Number, default: 12 },
    traumaBays: { type: Number, default: 0 },
    traumaBaysTotal: { type: Number, default: 4 },
    bloodUnits: { type: Number, default: 0 },
    bloodUnitsTotal: { type: Number, default: 40 },
    ventilators: { type: Number, default: 0 },
    ventilatorsTotal: { type: Number, default: 8 },
    surgeonsAvailable: { type: Number, default: 0 },
    surgeonsTotal: { type: Number, default: 3 },
  },
  { _id: false }
);

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    emergencyNumber: { type: String },
    city: { type: String },
    resources: { type: resourcesSchema, default: () => ({}) },
    currentCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emergency" }],
  },
  { timestamps: true }
);

hospitalSchema.index({ location: "2dsphere" });

export const Hospital = mongoose.model("Hospital", hospitalSchema);
