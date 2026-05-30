import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";
import { Ambulance } from "../models/Ambulance.js";
import { Emergency } from "../models/Emergency.js";
import { Hospital } from "../models/Hospital.js";
import {
  triggerSOS,
  acceptDispatch,
  arrivedAtPatient,
  arrivedAtHospital,
  emergencyRoom,
  userRoom,
  hospitalRoom,
} from "../services/dispatch.service.js";
import { env } from "../config/env.js";

export function initSocket(httpServer, app) {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowed = env.corsOrigins;
        if (allowed.includes(origin)) return callback(null, true);
        if (allowed.some((o) => o.includes("*.vercel.app") && /\.vercel\.app$/.test(origin))) {
          return callback(null, true);
        }
        if (!env.isProd) return callback(null, true);
        callback(new Error("CORS blocked"));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  app.set("io", io);

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("Authentication required"));
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(userRoom(socket.userId));

    if (socket.userRole === "hospital" && socket.user.linkedHospitalId) {
      socket.join(hospitalRoom(socket.user.linkedHospitalId.toString()));
    }

    if (socket.userRole === "ambulance") {
      Ambulance.findOne({ driverId: socket.userId }).then((amb) => {
        if (amb) socket.ambulanceId = amb._id.toString();
      });
    }

    socket.on("emergency:watch", async ({ emergencyId }) => {
      if (!emergencyId) return;
      const emergency = await Emergency.findById(emergencyId);
      if (!emergency) return;
      const allowed =
        String(emergency.patientId) === socket.userId ||
        (socket.userRole === "hospital" &&
          String(emergency.assignedHospital) === String(socket.user.linkedHospitalId)) ||
        (socket.userRole === "ambulance" &&
          String(emergency.assignedAmbulance) === socket.ambulanceId);
      if (allowed) {
        socket.join(emergencyRoom(emergencyId));
        socket.emit("emergency:state", { emergency });
      }
    });

    // citizen:sos_trigger
    socket.on("citizen:sos_trigger", async (payload, ack) => {
      try {
        if (socket.userRole !== "citizen") {
          throw new Error("Only citizens can trigger SOS");
        }
        if (!socket.user.isPhoneVerified || !socket.user.isVerified) {
          throw new Error("Account not verified");
        }

        const { coordinates, emergencyType, priority } = payload ?? {};
        if (!coordinates || coordinates.length !== 2) {
          throw new Error("coordinates [lng, lat] required");
        }

        const result = await triggerSOS({
          patientId: socket.userId,
          coordinates,
          emergencyType,
          priority,
        });

        const { emergency, ambulance, hospital, distances } = result;
        const eid = emergency._id.toString();

        socket.join(emergencyRoom(eid));

        const eventPayload = {
          emergency,
          distances,
        };

        io.to(userRoom(socket.userId)).emit("emergency:created", eventPayload);
        io.to(emergencyRoom(eid)).emit("emergency:dispatched", eventPayload);

        if (ambulance?.driverId) {
          io.to(userRoom(ambulance.driverId.toString())).emit("dispatch:incoming", {
            emergency,
            distances,
          });
        }

        if (hospital?._id) {
          io.to(hospitalRoom(hospital._id.toString())).emit("hospital:incoming_case", {
            emergency,
            distances,
          });
        }

        ack?.({ success: true, emergency });
      } catch (err) {
        ack?.({ success: false, error: err.message });
        socket.emit("error", { message: err.message });
      }
    });

    // ambulance:accept_dispatch
    socket.on("ambulance:accept_dispatch", async ({ emergencyId }, ack) => {
      try {
        if (socket.userRole !== "ambulance") throw new Error("Ambulance only");
        const amb = await Ambulance.findOne({ driverId: socket.userId });
        if (!amb) throw new Error("Ambulance profile not found");

        const emergency = await acceptDispatch({
          ambulanceId: amb._id,
          emergencyId,
          driverId: socket.userId,
        });

        const populated = await Emergency.findById(emergency._id)
          .populate("patientId", "profile medicalId")
          .populate("assignedAmbulance")
          .populate("assignedHospital");

        io.to(emergencyRoom(emergencyId)).emit("emergency:status_update", {
          emergency: populated,
          status: "enroute",
        });

        ack?.({ success: true, emergency: populated });
      } catch (err) {
        ack?.({ success: false, error: err.message });
      }
    });

    // ambulance:location_update
    socket.on("ambulance:location_update", async ({ emergencyId, coordinates, etaMinutes }) => {
      try {
        if (socket.userRole !== "ambulance") return;
        const amb = await Ambulance.findOneAndUpdate(
          { driverId: socket.userId },
          { currentLocation: { type: "Point", coordinates } },
          { new: true }
        );
        if (!amb) return;

        const update = {
          ambulanceId: amb._id,
          unitId: amb.unitId,
          coordinates,
          etaMinutes,
          timestamp: new Date(),
        };

        if (emergencyId) {
          io.to(emergencyRoom(emergencyId)).emit("tracking:update", update);
          if (etaMinutes != null) {
            await Emergency.findByIdAndUpdate(emergencyId, { etaMinutes });
          }
        }
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // hospital:resource_update
    socket.on("hospital:resource_update", async ({ resources }, ack) => {
      try {
        if (socket.userRole !== "hospital") throw new Error("Hospital only");
        const hospital = await Hospital.findByIdAndUpdate(
          socket.user.linkedHospitalId,
          { resources },
          { new: true }
        );
        if (!hospital) throw new Error("Hospital not found");

        io.to(hospitalRoom(hospital._id.toString())).emit("hospital:resource_update", {
          hospitalId: hospital._id,
          resources: hospital.resources,
        });

        io.emit("dashboard:resources", {
          hospitalId: hospital._id,
          resources: hospital.resources,
        });

        ack?.({ success: true, resources: hospital.resources });
      } catch (err) {
        ack?.({ success: false, error: err.message });
      }
    });

    // ambulance:arrived_at_patient
    socket.on("ambulance:arrived_at_patient", async ({ emergencyId }, ack) => {
      try {
        if (socket.userRole !== "ambulance") throw new Error("Ambulance only");
        const amb = await Ambulance.findOne({ driverId: socket.userId });

        const emergency = await arrivedAtPatient({
          emergencyId,
          ambulanceId: amb?._id,
        });

        const populated = await Emergency.findById(emergency._id)
          .populate("patientId", "profile medicalId")
          .populate("assignedAmbulance")
          .populate("assignedHospital");

        io.to(emergencyRoom(emergencyId)).emit("emergency:status_update", {
          emergency: populated,
          status: "transporting",
        });

        ack?.({ success: true, emergency: populated });
      } catch (err) {
        ack?.({ success: false, error: err.message });
      }
    });

    // ambulance:arrived_at_hospital
    socket.on("ambulance:arrived_at_hospital", async ({ emergencyId }, ack) => {
      try {
        if (socket.userRole !== "ambulance") throw new Error("Ambulance only");
        const amb = await Ambulance.findOne({ driverId: socket.userId });

        const emergency = await arrivedAtHospital({
          emergencyId,
          ambulanceId: amb?._id,
        });

        const populated = await Emergency.findById(emergency._id)
          .populate("patientId", "profile medicalId")
          .populate("assignedAmbulance")
          .populate("assignedHospital");

        io.to(emergencyRoom(emergencyId)).emit("emergency:closed", {
          emergency: populated,
          status: "closed",
        });

        if (populated.assignedHospital) {
          io.to(hospitalRoom(populated.assignedHospital._id.toString())).emit(
            "hospital:case_closed",
            { emergencyId }
          );
        }

        ack?.({ success: true, emergency: populated });
      } catch (err) {
        ack?.({ success: false, error: err.message });
      }
    });

    // Hospital dashboard subscribe
    socket.on("hospital:subscribe", () => {
      if (socket.userRole === "hospital" && socket.user.linkedHospitalId) {
        socket.join(hospitalRoom(socket.user.linkedHospitalId.toString()));
      }
    });

    socket.on("dispatch:subscribe", ({ phase }) => {
      socket.dispatchPhase = phase;
    });
  });

  return io;
}
