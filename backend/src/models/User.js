import mongoose from "mongoose";

const medicalIdSchema = new mongoose.Schema(
  {
    bloodGroup: { type: String },
    allergies: [{ type: String }],
    medications: [{ type: String }],
    conditions: [{ type: String }],
    emergencyContacts: [
      {
        name: String,
        phone: String,
        relation: String,
      },
    ],
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    city: { type: String },
    bloodGroup: { type: String },
    // Ambulance-specific
    registrationNumber: { type: String },
    operator: { type: String },
    license: { type: String },
    state: { type: String },
    ambulanceType: { type: String },
    // Hospital-specific
    hospitalName: { type: String },
    hospitalRegistrationNumber: { type: String },
    adminName: { type: String },
    adminDesignation: { type: String },
    emergencyNumber: { type: String },
    icuBeds: { type: Number },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["citizen", "ambulance", "hospital"],
      required: true,
    },
    passwordHash: { type: String },
    profile: { type: profileSchema, required: true },
    medicalId: { type: medicalIdSchema, default: () => ({}) },
    isVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    linkedAmbulanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    linkedHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ "profile.phone": 1 }, { sparse: true });
userSchema.index({ "profile.email": 1 }, { sparse: true });

export const User = mongoose.model("User", userSchema);
