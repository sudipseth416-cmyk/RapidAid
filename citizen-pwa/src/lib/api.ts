import type {
  NearbyHospital,
  NearbyAmbulance,
  MedicalIdSummary,
  MedicalIdProfile,
  UserProfile,
} from "../types";
import { saveMedicalIdOffline, loadMedicalIdOffline } from "./offline-storage";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchUserProfile(): Promise<UserProfile> {
  await delay(300);
  return { name: "Rajesh", city: "Mumbai", avatarInitials: "RK" };
}

export async function fetchNearbyHospital(): Promise<NearbyHospital> {
  await delay(400);
  return {
    name: "KEM Hospital",
    distanceKm: 1.2,
    icuBeds: 4,
    status: "available",
  };
}

export async function fetchNearbyAmbulance(): Promise<NearbyAmbulance> {
  await delay(350);
  return {
    unitId: "AMB-MH-042",
    distanceKm: 0.8,
    available: true,
  };
}

export async function fetchMedicalIdSummary(): Promise<MedicalIdSummary> {
  await delay(200);
  const profile = getStoredMedicalId();
  return {
    bloodGroup: profile.bloodGroup,
    allergies: profile.allergies.slice(0, 2),
    condition: profile.conditions[0] ?? "None",
    emergencyContact: profile.contacts[0] ?? { name: "—", phone: "—" },
  };
}

export function getStoredMedicalId(): MedicalIdProfile {
  return loadMedicalIdOffline();
}

export function saveMedicalId(profile: MedicalIdProfile): MedicalIdProfile {
  saveMedicalIdOffline(profile);
  return profile;
}

export async function fetchMedicalIdProfile(): Promise<MedicalIdProfile> {
  await delay(150);
  return getStoredMedicalId();
}

export async function updateMedicalIdProfile(
  profile: MedicalIdProfile
): Promise<MedicalIdProfile> {
  await delay(200);
  return saveMedicalId(profile);
}

export const AI_INSTRUCTIONS = [
  "Stay calm. Help is on the way — ETA updating live.",
  "Check if the person is breathing. Look for chest movement.",
  "If unconscious but breathing, place them in the recovery position.",
  "If not breathing, begin CPR: 30 chest compressions, then 2 rescue breaths.",
  "Keep the airway clear. Loosen tight clothing around neck and chest.",
  "Do not give food or water if the person is unconscious.",
  "Apply direct pressure to any visible bleeding with a clean cloth.",
  "Stay on the line — ambulance is approaching your location.",
];

export function generateCaseNumber(): string {
  return `RA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
