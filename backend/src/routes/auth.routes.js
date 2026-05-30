import { Router } from "express";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { User } from "../models/User.js";
import { Ambulance } from "../models/Ambulance.js";
import { Hospital } from "../models/Hospital.js";
import { signToken } from "../utils/jwt.js";
import { sendOtp, verifyOtp } from "../services/otp.service.js";
import {
  generateEmailToken,
  sendHospitalVerificationEmail,
} from "../services/email.service.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { isStubMode, stubFindUser } from "../config/stub-db.js";

const router = Router();

function authResponse(user, extras = {}) {
  const token = signToken({ userId: user._id.toString(), role: user.role });
  return {
    token,
    user: {
      id: user._id.toString(),
      role: user.role,
      profile: user.profile,
      medicalId: user.medicalId,
      isVerified: user.isVerified,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      isApproved: user.isApproved,
      linkedAmbulanceId: user.linkedAmbulanceId,
      linkedHospitalId: user.linkedHospitalId,
    },
    ...extras,
  };
}

// ——— OTP ———
router.post(
  "/otp/send",
  body("phone").notEmpty(),
  body("role").isIn(["citizen", "ambulance"]),
  validate,
  async (req, res, next) => {
    try {
      const { phone, role, purpose } = req.body;
      const result = await sendOtp(phone, purpose ?? "register", role);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/otp/verify",
  body("phone").notEmpty(),
  body("code").isLength({ min: 6, max: 6 }),
  validate,
  async (req, res, next) => {
    try {
      const result = await verifyOtp(req.body.phone, req.body.code);
      if (!result.valid) return res.status(400).json({ error: result.error });
      res.json({ verified: true, role: result.role });
    } catch (e) {
      next(e);
    }
  }
);

// ——— Citizen register ———
router.post(
  "/register/citizen",
  body("phone").notEmpty(),
  body("otp").isLength({ min: 6, max: 6 }),
  body("password").isLength({ min: 8 }),
  body("profile.name").notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const { phone, otp, password, profile, medicalId } = req.body;
      const otpResult = await verifyOtp(phone, otp);
      if (!otpResult.valid) return res.status(400).json({ error: otpResult.error });

      const existing = await User.findOne({ "profile.phone": phone.replace(/\s/g, "") });
      if (existing) return res.status(409).json({ error: "Phone already registered" });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({
        role: "citizen",
        passwordHash,
        profile: { ...profile, phone: phone.replace(/\s/g, "") },
        medicalId: medicalId ?? {},
        isPhoneVerified: true,
        isVerified: true,
      });

      res.status(201).json(authResponse(user));
    } catch (e) {
      next(e);
    }
  }
);

// ——— Ambulance register ———
router.post(
  "/register/ambulance",
  body("phone").notEmpty(),
  body("otp").isLength({ min: 6, max: 6 }),
  body("password").isLength({ min: 8 }),
  body("profile.name").notEmpty(),
  body("unitId").notEmpty(),
  body("coordinates").isArray({ min: 2, max: 2 }),
  validate,
  async (req, res, next) => {
    try {
      const { phone, otp, password, profile, unitId, coordinates, medicalId } = req.body;
      const otpResult = await verifyOtp(phone, otp);
      if (!otpResult.valid) return res.status(400).json({ error: otpResult.error });

      const existingUnit = await Ambulance.findOne({ unitId });
      if (existingUnit) return res.status(409).json({ error: "Unit ID already registered" });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({
        role: "ambulance",
        passwordHash,
        profile: { ...profile, phone: phone.replace(/\s/g, "") },
        medicalId: medicalId ?? {},
        isPhoneVerified: true,
        isVerified: true,
      });

      const ambulance = await Ambulance.create({
        unitId,
        driverId: user._id,
        currentLocation: { type: "Point", coordinates },
        status: "available",
      });

      user.linkedAmbulanceId = ambulance._id;
      await user.save();

      res.status(201).json(authResponse(user, { ambulance }));
    } catch (e) {
      next(e);
    }
  }
);

// ——— Hospital register (email verification + manual approval) ———
router.post(
  "/register/hospital",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("profile.hospitalName").notEmpty(),
  body("coordinates").isArray({ min: 2, max: 2 }),
  validate,
  async (req, res, next) => {
    try {
      const { email, password, profile, coordinates, registrationNumber } = req.body;

      const existing = await User.findOne({ "profile.email": email.toLowerCase() });
      if (existing) return res.status(409).json({ error: "Email already registered" });

      const token = generateEmailToken();
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create({
        role: "hospital",
        passwordHash,
        profile: {
          ...profile,
          name: profile.name || profile.adminName || profile.hospitalName,
          email: email.toLowerCase(),
        },
        isEmailVerified: false,
        isApproved: false,
        isVerified: false,
        emailVerificationToken: token,
        emailVerificationExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
      });

      const hospital = await Hospital.create({
        name: profile.hospitalName,
        registrationNumber: registrationNumber ?? profile.hospitalRegistrationNumber,
        adminUserId: user._id,
        location: { type: "Point", coordinates },
        emergencyNumber: profile.emergencyNumber,
        city: profile.city,
        resources: {
          icuBeds: profile.icuBeds ?? 4,
          icuBedsTotal: profile.icuBeds ?? 12,
          traumaBays: 2,
          traumaBaysTotal: 4,
        },
      });

      user.linkedHospitalId = hospital._id;
      await user.save();

      await sendHospitalVerificationEmail(user);

      res.status(201).json({
        message: "Registration received. Verify your email. Account requires manual approval.",
        userId: user._id,
        hospitalId: hospital._id,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/verify-email", async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Invalid token");

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).send("Invalid or expired verification link");

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.send(
      "<h1>Email verified</h1><p>Your hospital account is pending manual approval from RapidAid operations.</p>"
    );
  } catch (e) {
    next(e);
  }
});

// Admin: approve hospital (x-admin-key header)
router.post(
  "/hospital/:userId/approve",
  async (req, res, next) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (!process.env.ADMIN_APPROVAL_KEY || adminKey !== process.env.ADMIN_APPROVAL_KEY) {
        return res.status(403).json({ error: "Valid x-admin-key required" });
      }

      const user = await User.findById(req.params.userId);
      if (!user || user.role !== "hospital") {
        return res.status(404).json({ error: "Hospital user not found" });
      }
      if (!user.isEmailVerified) {
        return res.status(400).json({ error: "Email not verified yet" });
      }

      user.isApproved = true;
      user.isVerified = true;
      await user.save();

      const { sendHospitalApprovedEmail } = await import("../services/email.service.js");
      await sendHospitalApprovedEmail(user);

      res.json({ approved: true, userId: user._id });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/login",
  body("identifier").notEmpty(),
  body("password").notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const { identifier, password, role } = req.body;
      const id = identifier.trim();

      if (isStubMode()) {
        const user = stubFindUser({ identifier: id, role: role || undefined });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });
        return res.json(authResponse(user));
      }

      const idLower = id.toLowerCase();
      const phoneNorm = id.replace(/\s/g, "");
      const query = role
        ? {
            role,
            $or: [
              { "profile.email": idLower },
              { "profile.phone": phoneNorm },
              { "profile.phone": id },
            ],
          }
        : {
            $or: [
              { "profile.email": idLower },
              { "profile.phone": phoneNorm },
              { "profile.phone": id },
            ],
          };

      const user = await User.findOne(query);
      if (!user?.passwordHash) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      if (user.role === "hospital") {
        if (!user.isEmailVerified) {
          return res.status(403).json({ error: "Please verify your email first" });
        }
        if (!user.isApproved) {
          return res.status(403).json({ error: "Hospital account pending approval" });
        }
      }

      res.json(authResponse(user));
    } catch (e) {
      next(e);
    }
  }
);

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
