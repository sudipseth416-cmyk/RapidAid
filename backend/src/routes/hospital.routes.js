import { Router } from "express";
import { body } from "express-validator";
import { Hospital } from "../models/Hospital.js";
import { Emergency } from "../models/Emergency.js";
import { authenticate, requireRole, requireVerified } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/me", authenticate, requireRole("hospital"), requireVerified, async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.user.linkedHospitalId).populate("currentCases");
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.json({ hospital });
  } catch (e) {
    next(e);
  }
});

router.get(
  "/me/cases",
  authenticate,
  requireRole("hospital"),
  requireVerified,
  async (req, res, next) => {
    try {
      const cases = await Emergency.find({ assignedHospital: req.user.linkedHospitalId })
        .sort({ createdAt: -1 })
        .populate("patientId", "profile medicalId")
        .populate("assignedAmbulance");
      res.json({ cases });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/me/resources",
  authenticate,
  requireRole("hospital"),
  requireVerified,
  body("resources").isObject(),
  validate,
  async (req, res, next) => {
    try {
      const hospital = await Hospital.findByIdAndUpdate(
        req.user.linkedHospitalId,
        { $set: { resources: { ...req.body.resources } } },
        { new: true }
      );
      if (!hospital) return res.status(404).json({ error: "Hospital not found" });

      req.app.get("io")?.to(`hospital:${hospital._id}`).emit("hospital:resource_update", {
        hospitalId: hospital._id,
        resources: hospital.resources,
      });

      res.json({ hospital });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
