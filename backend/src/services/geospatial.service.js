import { Ambulance } from "../models/Ambulance.js";
import { Hospital } from "../models/Hospital.js";
import { env } from "../config/env.js";

/**
 * @param {[number, number]} coordinates [lng, lat]
 */
export async function findNearestAvailableAmbulance(coordinates) {
  const radiusMeters = env.nearestAmbulanceRadiusKm * 1000;

  const results = await Ambulance.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates },
        distanceField: "distanceMeters",
        maxDistance: radiusMeters,
        spherical: true,
        query: { status: "available" },
      },
    },
    { $limit: 1 },
  ]);

  return results[0] ?? null;
}

export async function findNearestHospital(coordinates) {
  const results = await Hospital.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates },
        distanceField: "distanceMeters",
        spherical: true,
      },
    },
    { $limit: 1 },
  ]);

  return results[0] ?? null;
}

export function distanceKm(distanceMeters) {
  return Math.round((distanceMeters / 1000) * 10) / 10;
}
