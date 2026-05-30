import { Router } from "express";
import { body } from "express-validator";
import { Emergency } from "../models/Emergency.js";
import { authenticate, requireRole, requireVerified } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { triggerSOS } from "../services/dispatch.service.js";

const router = Router();

router.get("/", authenticate, requireVerified, async (req, res, next) => {
  try {
    let filter = {};
    if (req.userRole === "citizen") filter.patientId = req.userId;
    if (req.userRole === "ambulance") {
      const { Ambulance } = await import("../models/Ambulance.js");
      const amb = await Ambulance.findOne({ driverId: req.userId });
      if (amb) filter.assignedAmbulance = amb._id;
    }
    if (req.userRole === "hospital") {
      filter.assignedHospital = req.user.linkedHospitalId;
    }

    const cases = await Emergency.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("patientId", "profile medicalId")
      .populate("assignedAmbulance")
      .populate("assignedHospital");

    res.json({ cases });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, requireVerified, async (req, res, next) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate("patientId", "profile medicalId")
      .populate("assignedAmbulance")
      .populate("assignedHospital");
    if (!emergency) return res.status(404).json({ error: "Not found" });
    res.json({ emergency });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/sos",
  authenticate,
  requireRole("citizen"),
  requireVerified,
  body("coordinates").isArray({ min: 2, max: 2 }),
  body("emergencyType").optional().isString(),
  validate,
  async (req, res, next) => {
    try {
      const { coordinates, emergencyType, priority } = req.body;
      const result = await triggerSOS({
        patientId: req.userId,
        coordinates,
        emergencyType,
        priority,
      });
      res.status(201).json(result);
    } catch (e) {
      const status = e.message.includes("No available") ? 503 : 400;
      e.status = status;
      next(e);
    }
  }
);

export default router;
