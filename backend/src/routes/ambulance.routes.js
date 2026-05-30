import { Router } from "express";
import { body } from "express-validator";
import { Ambulance } from "../models/Ambulance.js";
import { authenticate, requireRole, requireVerified } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/me", authenticate, requireRole("ambulance"), requireVerified, async (req, res, next) => {
  try {
    const ambulance = await Ambulance.findOne({ driverId: req.userId });
    if (!ambulance) return res.status(404).json({ error: "Ambulance profile not found" });
    res.json({ ambulance });
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/me/location",
  authenticate,
  requireRole("ambulance"),
  requireVerified,
  body("coordinates").isArray({ min: 2, max: 2 }),
  validate,
  async (req, res, next) => {
    try {
      const ambulance = await Ambulance.findOneAndUpdate(
        { driverId: req.userId },
        { currentLocation: { type: "Point", coordinates: req.body.coordinates } },
        { new: true }
      );
      if (!ambulance) return res.status(404).json({ error: "Ambulance not found" });
      res.json({ ambulance });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/me/status",
  authenticate,
  requireRole("ambulance"),
  requireVerified,
  body("status").isIn(["available", "unavailable"]),
  validate,
  async (req, res, next) => {
    try {
      if (req.body.status === "available") {
        const active = await Ambulance.findOne({ driverId: req.userId, activeEmergencyId: { $ne: null } });
        if (active) {
          return res.status(400).json({ error: "Cannot set available during active dispatch" });
        }
      }
      const ambulance = await Ambulance.findOneAndUpdate(
        { driverId: req.userId },
        { status: req.body.status },
        { new: true }
      );
      res.json({ ambulance });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
