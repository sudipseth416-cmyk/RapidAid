import type {
  EmergencyCase,
  DashboardMetrics,
  ResourceItem,
  BloodInventoryItem,
  StaffMember,
  CriticalAlert,
  TimelineStep,
} from "./types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const defaultTimeline = (
  activeStep: TimelineStep
): EmergencyCase["timeline"] => {
  const steps: TimelineStep[] = [
    "sos",
    "dispatch",
    "hospital_alert",
    "enroute",
    "pickup",
    "arrival",
  ];
  const activeIdx = steps.indexOf(activeStep);
  return steps.reduce(
    (acc, step, i) => {
      acc[step] =
        i < activeIdx ? "complete" : i === activeIdx ? "active" : "pending";
      return acc;
    },
    {} as EmergencyCase["timeline"]
  );
};

let casesStore: EmergencyCase[] = [
  {
    id: "RA-K7M2P9",
    type: "Cardiac Arrest",
    severity: "critical",
    status: "enroute",
    patient: {
      name: "Rajesh Kumar",
      age: 58,
      sex: "M",
      bloodGroup: "B+",
      allergies: ["Penicillin"],
      conditions: ["Type 2 Diabetes", "Hypertension"],
    },
    ambulanceUnit: "AMB-MH-042",
    etaMinutes: 4,
    timeline: defaultTimeline("enroute"),
    assignedTraumaBay: "Trauma Bay 2",
    surgeonNotified: true,
  },
  {
    id: "RA-M3N8Q1",
    type: "Road Traffic Accident",
    severity: "critical",
    status: "incoming",
    patient: {
      name: "Priya Sharma",
      age: 34,
      sex: "F",
      bloodGroup: "O+",
      allergies: ["Latex"],
      conditions: [],
    },
    ambulanceUnit: "AMB-MH-017",
    etaMinutes: 7,
    timeline: defaultTimeline("hospital_alert"),
  },
  {
    id: "RA-P2L5R8",
    type: "Respiratory Distress",
    severity: "urgent",
    status: "transporting",
    patient: {
      name: "Anil Mehta",
      age: 72,
      sex: "M",
      bloodGroup: "A+",
      allergies: [],
      conditions: ["COPD"],
    },
    ambulanceUnit: "AMB-MH-031",
    etaMinutes: 11,
    timeline: defaultTimeline("pickup"),
    assignedTraumaBay: "ICU Bay 4",
  },
  {
    id: "RA-T9W4X2",
    type: "Fall / Fracture",
    severity: "stable",
    status: "incoming",
    patient: {
      name: "Sunita Desai",
      age: 45,
      sex: "F",
      bloodGroup: "AB+",
      allergies: ["Aspirin"],
      conditions: ["Osteoporosis"],
    },
    ambulanceUnit: "AMB-MH-008",
    etaMinutes: 14,
    timeline: defaultTimeline("dispatch"),
  },
];

let resourcesStore: ResourceItem[] = [
  { id: "icu", label: "ICU Beds", current: 4, total: 12 },
  { id: "trauma", label: "Trauma Bays", current: 1, total: 4 },
  { id: "surgeons", label: "Surgeons Available", current: 2, total: 3 },
  { id: "blood", label: "Blood Units (O+)", current: 18, total: 40 },
  { id: "ventilators", label: "Ventilators", current: 3, total: 8 },
];

let bloodStore: BloodInventoryItem[] = [
  { type: "O+", units: 18, minThreshold: 15 },
  { type: "O-", units: 6, minThreshold: 8 },
  { type: "A+", units: 12, minThreshold: 10 },
  { type: "B+", units: 9, minThreshold: 10 },
  { type: "AB+", units: 3, minThreshold: 5 },
];

let staffStore: StaffMember[] = [
  { id: "1", name: "Dr. Ananya Sharma", role: "Emergency Dept. Head", shift: "07:00–19:00", onDuty: true },
  { id: "2", name: "Dr. Vikram Patel", role: "Trauma Surgeon", shift: "07:00–19:00", onDuty: true },
  { id: "3", name: "Nurse Kavita Rao", role: "ICU Charge Nurse", shift: "19:00–07:00", onDuty: true },
  { id: "4", name: "Dr. Meera Joshi", role: "Anesthesiologist", shift: "Off shift", onDuty: false },
];

export async function fetchMetrics(): Promise<DashboardMetrics> {
  await delay(100);
  const active = casesStore.filter((c) => c.status !== "closed" && c.status !== "arrived");
  const icu = resourcesStore.find((r) => r.id === "icu");
  return {
    activeEmergencies: active.length,
    icuBedsAvailable: icu?.current ?? 0,
    icuBedsTotal: icu?.total ?? 12,
    ambulancesTracked: new Set(casesStore.map((c) => c.ambulanceUnit)).size,
    avgResponseTimeMin: 6.2,
  };
}

export async function fetchCriticalAlerts(): Promise<CriticalAlert[]> {
  await delay(80);
  return casesStore
    .filter((c) => c.severity === "critical" && c.status !== "arrived")
    .map((c) => ({
      caseId: c.id,
      type: c.type,
      etaMinutes: c.etaMinutes,
      patientSummary: `${c.patient.name}, ${c.patient.age}${c.patient.sex} · ${c.patient.bloodGroup}`,
    }));
}

export async function fetchCases(): Promise<EmergencyCase[]> {
  await delay(120);
  casesStore = casesStore.map((c) =>
    c.status === "enroute" && c.etaMinutes > 1
      ? { ...c, etaMinutes: Math.max(1, c.etaMinutes - 0.3) }
      : c
  );
  return [...casesStore];
}

export async function fetchCaseById(id: string): Promise<EmergencyCase | undefined> {
  await delay(50);
  return casesStore.find((c) => c.id === id);
}

export async function fetchResources(): Promise<ResourceItem[]> {
  await delay(100);
  return [...resourcesStore];
}

export async function updateResource(
  id: string,
  current: number
): Promise<ResourceItem[]> {
  await delay(150);
  resourcesStore = resourcesStore.map((r) =>
    r.id === id ? { ...r, current: Math.min(r.total, Math.max(0, current)) } : r
  );
  return [...resourcesStore];
}

export async function fetchBloodInventory(): Promise<BloodInventoryItem[]> {
  await delay(80);
  return [...bloodStore];
}

export async function fetchStaff(): Promise<StaffMember[]> {
  await delay(80);
  return [...staffStore];
}

export async function assignTraumaBay(caseId: string): Promise<EmergencyCase | undefined> {
  await delay(200);
  const idx = casesStore.findIndex((c) => c.id === caseId);
  if (idx === -1) return undefined;
  casesStore[idx] = {
    ...casesStore[idx],
    assignedTraumaBay: "Trauma Bay 2",
    timeline: defaultTimeline("hospital_alert"),
  };
  return casesStore[idx];
}

export async function notifySurgeon(caseId: string): Promise<EmergencyCase | undefined> {
  await delay(200);
  const idx = casesStore.findIndex((c) => c.id === caseId);
  if (idx === -1) return undefined;
  casesStore[idx] = { ...casesStore[idx], surgeonNotified: true };
  return casesStore[idx];
}

export function getUtilization(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

export function getResourceColor(
  current: number,
  total: number
): "green" | "amber" | "red" {
  const availablePct = (current / total) * 100;
  if (availablePct >= 40) return "green";
  if (availablePct >= 20) return "amber";
  return "red";
}
