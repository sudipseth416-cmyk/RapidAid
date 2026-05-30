import type { DispatchAlert, OperatorProfile } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchOperatorProfile(): Promise<OperatorProfile> {
  await delay(200);
  return {
    unitNumber: "AMB-MH-042",
    driverName: "Amit Singh",
    onDuty: true,
    location: "Bandra West, Mumbai",
    casesToday: 3,
  };
}

export const MOCK_DISPATCH: DispatchAlert = {
  id: "disp-001",
  caseId: "RA-K7M2P9",
  emergencyType: "Cardiac Arrest",
  priority: "critical",
  patient: {
    name: "Rajesh Kumar",
    age: 58,
    sex: "M",
    bloodGroup: "B+",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    allergies: ["Penicillin"],
  },
  distanceKm: 1.4,
};

export async function simulateIncomingDispatch(): Promise<DispatchAlert | null> {
  await delay(8000);
  return MOCK_DISPATCH;
}

export function interpolateRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  progress: number
): { lat: number; lng: number } {
  const t = Math.min(1, Math.max(0, progress / 100));
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const CONSCIOUSNESS_OPTIONS = [
  { value: "alert", label: "Alert" },
  { value: "verbal", label: "Verbal" },
  { value: "pain", label: "Pain" },
  { value: "unresponsive", label: "Unresponsive" },
] as const;
