import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Ambulance } from "../models/Ambulance.js";
import { Hospital } from "../models/Hospital.js";
import bcrypt from "bcryptjs";

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Ambulance.deleteMany({}),
    Hospital.deleteMany({}),
  ]);

  const hash = await bcrypt.hash("password123", 12);

  const citizen = await User.create({
    role: "citizen",
    passwordHash: hash,
    profile: { name: "Rajesh Kumar", phone: "+919876543210", city: "Mumbai" },
    medicalId: {
      bloodGroup: "B+",
      allergies: ["Penicillin"],
      conditions: ["Type 2 Diabetes"],
      emergencyContacts: [{ name: "Priya Kumar", phone: "+919876543211", relation: "Spouse" }],
    },
    isPhoneVerified: true,
    isVerified: true,
  });

  const driver = await User.create({
    role: "ambulance",
    passwordHash: hash,
    profile: { name: "Amit Singh", phone: "+919876543220" },
    isPhoneVerified: true,
    isVerified: true,
  });

  const ambulance = await Ambulance.create({
    unitId: "AMB-MH-042",
    driverId: driver._id,
    currentLocation: { type: "Point", coordinates: [72.8777, 19.076] },
    status: "available",
  });
  driver.linkedAmbulanceId = ambulance._id;
  await driver.save();

  const hospitalAdmin = await User.create({
    role: "hospital",
    passwordHash: hash,
    profile: {
      name: "Dr. Ananya Sharma",
      email: "emergency@kemhospital.dev",
      hospitalName: "KEM Hospital",
      adminName: "Dr. Ananya Sharma",
      city: "Mumbai",
    },
    isEmailVerified: true,
    isApproved: true,
    isVerified: true,
  });

  const hospital = await Hospital.create({
    name: "KEM Hospital",
    registrationNumber: "HOS/MH/KEM/001",
    adminUserId: hospitalAdmin._id,
    location: { type: "Point", coordinates: [72.854, 19.021] },
    city: "Mumbai",
    emergencyNumber: "+912212345678",
    resources: {
      icuBeds: 4,
      icuBedsTotal: 12,
      traumaBays: 2,
      traumaBaysTotal: 4,
      bloodUnits: 18,
      bloodUnitsTotal: 40,
      ventilators: 3,
      ventilatorsTotal: 8,
      surgeonsAvailable: 2,
      surgeonsTotal: 3,
    },
  });

  hospitalAdmin.linkedHospitalId = hospital._id;
  await hospitalAdmin.save();

  // Additional available ambulances for geospatial testing
  const driver2 = await User.create({
    role: "ambulance",
    passwordHash: hash,
    profile: { name: "Vikram Das", phone: "+919876543221" },
    isPhoneVerified: true,
    isVerified: true,
  });

  await Ambulance.create({
    unitId: "AMB-MH-017",
    driverId: driver2._id,
    currentLocation: { type: "Point", coordinates: [72.885, 19.082] },
    status: "available",
  });

  console.log("Seed complete:");
  console.log("  Citizen:", citizen.profile.phone, "/ password123");
  console.log("  Ambulance:", driver.profile.phone, "unit", ambulance.unitId);
  console.log("  Hospital:", hospitalAdmin.profile.email);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
