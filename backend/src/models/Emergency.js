import mongoose from "mongoose";

const timelineEntrySchema = new mongoose.Schema(
  {
    step: {
      type: String,
      enum: ["sos", "dispatch", "hospital_alert", "enroute", "pickup", "arrival"],
      required: true,
    },
    status: { type: String, enum: ["pending", "active", "complete"], default: "complete" },
    timestamp: { type: Date, default: Date.now },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const emergencySchema = new mongoose.Schema(
  {
    caseNumber: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "dispatched",
        "enroute",
        "at_patient",
        "transporting",
        "arrived",
        "closed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
    emergencyType: { type: String, default: "General Emergency" },
    priority: {
      type: String,
      enum: ["critical", "urgent", "standard"],
      default: "urgent",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true },
    },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedAmbulance: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    assignedHospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    timeline: [timelineEntrySchema],
    etaMinutes: { type: Number },
    notes: { type: String },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

emergencySchema.index({ location: "2dsphere" });
emergencySchema.index({ patientId: 1, status: 1 });

export const Emergency = mongoose.model("Emergency", emergencySchema);
