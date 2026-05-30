export interface UserProfile {
  name: string;
  city: string;
  avatarInitials: string;
}

export interface NearbyHospital {
  name: string;
  distanceKm: number;
  icuBeds: number;
  status: "available" | "limited" | "full";
}

export interface NearbyAmbulance {
  unitId: string;
  distanceKm: number;
  available: boolean;
}

export interface MedicalIdSummary {
  bloodGroup: string;
  allergies: string[];
  condition: string;
  emergencyContact: { name: string; phone: string };
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface MedicalIdProfile {
  bloodGroup: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  contacts: EmergencyContact[];
}

export interface ActiveEmergency {
  caseNumber: string;
  etaMinutes: number;
  hospitalName: string;
  ambulanceUnitId: string;
  aiStep: number;
  aiInstructions: string[];
}

export type NavTab = "sos" | "medid" | "track" | "profile";

export type TrackingUpdate = {
  etaMinutes: number;
  ambulanceProgress: number;
  aiStep: number;
};
