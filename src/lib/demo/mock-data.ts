import type { EmergencyCase, DashboardMetrics, ResourceItem, BloodInventoryItem, StaffMember, CriticalAlert } from "@/lib/dashboard/types";

export const DEMO_ACTIVE_EMERGENCY: EmergencyCase = {
  id: "RA-DEMO01",
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
  timeline: {
    sos: "complete",
    dispatch: "complete",
    hospital_alert: "complete",
    enroute: "active",
    pickup: "pending",
    arrival: "pending",
  },
  assignedTraumaBay: "Trauma Bay 2",
  surgeonNotified: true,
};

export const DEMO_CASES: EmergencyCase[] = [
  DEMO_ACTIVE_EMERGENCY,
  {
    id: "RA-DEMO02",
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
    timeline: {
      sos: "complete",
      dispatch: "complete",
      hospital_alert: "active",
      enroute: "pending",
      pickup: "pending",
      arrival: "pending",
    },
  },
  {
    id: "RA-DEMO03",
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
    timeline: {
      sos: "complete",
      dispatch: "complete",
      hospital_alert: "complete",
      enroute: "complete",
      pickup: "complete",
      arrival: "active",
    },
    assignedTraumaBay: "ICU Bay 4",
  },
];

export const DEMO_AMBULANCES = [
  { unitId: "AMB-MH-042", driver: "Amit Singh", status: "dispatched" as const, distanceKm: 1.4, emergencyId: "RA-DEMO01" },
  { unitId: "AMB-MH-017", driver: "Vikram Das", status: "available" as const, distanceKm: 2.1 },
  { unitId: "AMB-MH-031", driver: "Suresh Nair", status: "dispatched" as const, distanceKm: 3.2, emergencyId: "RA-DEMO03" },
];

export const DEMO_HOSPITALS = [
  {
    name: "KEM Hospital",
    city: "Mumbai",
    icuBeds: 4,
    icuTotal: 12,
    traumaBays: 1,
    traumaTotal: 4,
    activeCases: 2,
  },
  {
    name: "Lilavati Hospital",
    city: "Mumbai",
    icuBeds: 7,
    icuTotal: 16,
    traumaBays: 3,
    traumaTotal: 6,
    activeCases: 1,
  },
];

export const DEMO_METRICS: DashboardMetrics = {
  activeEmergencies: 3,
  icuBedsAvailable: 4,
  icuBedsTotal: 12,
  ambulancesTracked: 3,
  avgResponseTimeMin: 6.2,
};

export const DEMO_CRITICAL_ALERTS: CriticalAlert[] = [
  {
    caseId: DEMO_ACTIVE_EMERGENCY.id,
    type: DEMO_ACTIVE_EMERGENCY.type,
    etaMinutes: 4,
    patientSummary: "Rajesh Kumar, 58M · B+",
  },
];

export const DEMO_RESOURCES: ResourceItem[] = [
  { id: "icu", label: "ICU Beds", current: 4, total: 12 },
  { id: "trauma", label: "Trauma Bays", current: 1, total: 4 },
  { id: "surgeons", label: "Surgeons Available", current: 2, total: 3 },
  { id: "blood", label: "Blood Units (O+)", current: 18, total: 40 },
  { id: "ventilators", label: "Ventilators", current: 3, total: 8 },
];

export const DEMO_BLOOD: BloodInventoryItem[] = [
  { type: "O+", units: 18, minThreshold: 15 },
  { type: "O-", units: 6, minThreshold: 8 },
  { type: "A+", units: 12, minThreshold: 10 },
  { type: "B+", units: 9, minThreshold: 10 },
];

export const DEMO_STAFF: StaffMember[] = [
  { id: "1", name: "Dr. Ananya Sharma", role: "Emergency Dept. Head", shift: "07:00–19:00", onDuty: true },
  { id: "2", name: "Dr. Vikram Patel", role: "Trauma Surgeon", shift: "07:00–19:00", onDuty: true },
  { id: "3", name: "Nurse Kavita Rao", role: "ICU Charge Nurse", shift: "19:00–07:00", onDuty: true },
];
