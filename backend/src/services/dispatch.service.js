import crypto from "crypto";
import { Emergency } from "../models/Emergency.js";
import { Ambulance } from "../models/Ambulance.js";
import { Hospital } from "../models/Hospital.js";
import { User } from "../models/User.js";
import {
  initEmergencyTimeline,
  appendTimeline,
  activateTimelineStep,
} from "../utils/timeline.js";
import {
  findNearestAvailableAmbulance,
  findNearestHospital,
  distanceKm,
} from "./geospatial.service.js";

function generateCaseNumber() {
  return `RA-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function triggerSOS({ patientId, coordinates, emergencyType, priority }) {
  const patient = await User.findById(patientId);
  if (!patient || patient.role !== "citizen") {
    throw new Error("Invalid citizen patient");
  }

  const active = await Emergency.findOne({
    patientId,
    status: { $nin: ["closed", "cancelled", "arrived"] },
  });
  if (active) {
    throw new Error("Active emergency already exists for this patient");
  }

  const nearestAmbulance = await findNearestAvailableAmbulance(coordinates);
  const nearestHospital = await findNearestHospital(coordinates);

  if (!nearestAmbulance) {
    throw new Error("No available ambulance within radius");
  }

  let timeline = initEmergencyTimeline();
  timeline = appendTimeline(timeline, "dispatch", {
    ambulanceId: nearestAmbulance._id,
    unitId: nearestAmbulance.unitId,
  });

  if (nearestHospital) {
    timeline = appendTimeline(timeline, "hospital_alert", {
      hospitalId: nearestHospital._id,
      hospitalName: nearestHospital.name,
    });
  }

  timeline = activateTimelineStep(timeline, "enroute");

  const etaMinutes = nearestAmbulance.distanceMeters
    ? Math.max(2, Math.ceil(nearestAmbulance.distanceMeters / 500))
    : 8;

  const emergency = await Emergency.create({
    caseNumber: generateCaseNumber(),
    status: "dispatched",
    emergencyType: emergencyType ?? "General Emergency",
    priority: priority ?? "urgent",
    location: { type: "Point", coordinates },
    patientId,
    assignedAmbulance: nearestAmbulance._id,
    assignedHospital: nearestHospital?._id,
    timeline,
    etaMinutes,
  });

  await Ambulance.findByIdAndUpdate(nearestAmbulance._id, {
    status: "dispatched",
    activeEmergencyId: emergency._id,
  });

  if (nearestHospital) {
    await Hospital.findByIdAndUpdate(nearestHospital._id, {
      $addToSet: { currentCases: emergency._id },
    });
  }

  const populated = await Emergency.findById(emergency._id)
    .populate("patientId", "profile medicalId")
    .populate("assignedAmbulance")
    .populate("assignedHospital");

  return {
    emergency: populated,
    ambulance: nearestAmbulance,
    hospital: nearestHospital,
    distances: {
      ambulanceKm: nearestAmbulance.distanceMeters
        ? distanceKm(nearestAmbulance.distanceMeters)
        : null,
      hospitalKm: nearestHospital?.distanceMeters
        ? distanceKm(nearestHospital.distanceMeters)
        : null,
    },
  };
}

export async function acceptDispatch({ ambulanceId, emergencyId, driverId }) {
  const ambulance = await Ambulance.findOne({ _id: ambulanceId, driverId });
  if (!ambulance) throw new Error("Ambulance not found for driver");

  const emergency = await Emergency.findById(emergencyId);
  if (!emergency) throw new Error("Emergency not found");
  if (String(emergency.assignedAmbulance) !== String(ambulanceId)) {
    throw new Error("Emergency not assigned to this ambulance");
  }

  emergency.status = "enroute";
  emergency.timeline = activateTimelineStep(emergency.timeline, "enroute");
  await emergency.save();

  return emergency;
}

export async function arrivedAtPatient({ emergencyId, ambulanceId }) {
  const emergency = await Emergency.findById(emergencyId);
  if (!emergency) throw new Error("Emergency not found");

  emergency.status = "transporting";
  emergency.timeline = appendTimeline(emergency.timeline, "pickup");
  if (emergency.assignedHospital) {
    emergency.timeline = activateTimelineStep(emergency.timeline, "arrival", {
      phase: "transporting_to_hospital",
    });
  }
  await emergency.save();
  return emergency;
}

export async function arrivedAtHospital({ emergencyId, ambulanceId }) {
  const emergency = await Emergency.findById(emergencyId);
  if (!emergency) throw new Error("Emergency not found");

  emergency.status = "closed";
  emergency.closedAt = new Date();
  emergency.timeline = appendTimeline(emergency.timeline, "arrival");
  await emergency.save();

  if (emergency.assignedAmbulance) {
    await Ambulance.findByIdAndUpdate(emergency.assignedAmbulance, {
      status: "available",
      activeEmergencyId: null,
    });
  }

  if (emergency.assignedHospital) {
    await Hospital.findByIdAndUpdate(emergency.assignedHospital, {
      $pull: { currentCases: emergency._id },
    });
  }

  return emergency;
}

export function emergencyRoom(emergencyId) {
  return `emergency:${emergencyId}`;
}

export function userRoom(userId) {
  return `user:${userId}`;
}

export function hospitalRoom(hospitalId) {
  return `hospital:${hospitalId}`;
}
