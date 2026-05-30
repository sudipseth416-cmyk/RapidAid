import type { ActiveEmergency, TrackingUpdate, MedicalIdProfile } from "../types";

const KEYS = {
  medicalId: "rapidaid-offline-medical-id",
  legacyMedicalId: "rapidaid-medical-id",
  emergency: "rapidaid-offline-emergency",
  tracking: "rapidaid-offline-tracking",
  activeTab: "rapidaid-offline-tab",
} as const;

const defaultMedicalId: MedicalIdProfile = {
  bloodGroup: "B+",
  allergies: ["Penicillin", "Peanuts"],
  medications: ["Metformin 500mg"],
  conditions: ["Type 2 Diabetes"],
  contacts: [
    { id: "1", name: "Priya Kumar", phone: "+91 98765 43211", relation: "Spouse" },
    { id: "2", name: "Anil Kumar", phone: "+91 98765 43212", relation: "Brother" },
  ],
};

export function loadMedicalIdOffline(): MedicalIdProfile {
  for (const key of [KEYS.medicalId, KEYS.legacyMedicalId]) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as MedicalIdProfile;
    } catch {
      /* ignore */
    }
  }
  return { ...defaultMedicalId, contacts: [...defaultMedicalId.contacts] };
}

export function saveMedicalIdOffline(profile: MedicalIdProfile) {
  const json = JSON.stringify(profile);
  localStorage.setItem(KEYS.medicalId, json);
  localStorage.setItem(KEYS.legacyMedicalId, json);
}

export function loadEmergencyOffline(): {
  emergency: ActiveEmergency | null;
  tracking: TrackingUpdate;
  activeTab: string | null;
} {
  try {
    const emergency = localStorage.getItem(KEYS.emergency);
    const tracking = localStorage.getItem(KEYS.tracking);
    const activeTab = localStorage.getItem(KEYS.activeTab);
    return {
      emergency: emergency ? (JSON.parse(emergency) as ActiveEmergency) : null,
      tracking: tracking
        ? (JSON.parse(tracking) as TrackingUpdate)
        : { etaMinutes: 8, ambulanceProgress: 0, aiStep: 0 },
      activeTab,
    };
  } catch {
    return {
      emergency: null,
      tracking: { etaMinutes: 8, ambulanceProgress: 0, aiStep: 0 },
      activeTab: null,
    };
  }
}

export function saveEmergencyOffline(
  emergency: ActiveEmergency | null,
  tracking: TrackingUpdate,
  activeTab: string
) {
  if (emergency) {
    localStorage.setItem(KEYS.emergency, JSON.stringify(emergency));
    localStorage.setItem(KEYS.tracking, JSON.stringify(tracking));
    localStorage.setItem(KEYS.activeTab, activeTab);
  } else {
    localStorage.removeItem(KEYS.emergency);
    localStorage.removeItem(KEYS.tracking);
    localStorage.removeItem(KEYS.activeTab);
  }
}

export const OFFLINE_CACHE_KEYS = KEYS;
