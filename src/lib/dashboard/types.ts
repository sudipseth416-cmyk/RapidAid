export type Severity = "critical" | "urgent" | "stable";
export type CaseStatus = "incoming" | "enroute" | "transporting" | "arrived" | "closed";
export type CaseFilter = "all" | "critical" | "stable" | "incoming";

export type TimelineStep =
  | "sos"
  | "dispatch"
  | "hospital_alert"
  | "enroute"
  | "pickup"
  | "arrival";

export interface PatientMedicalId {
  name: string;
  age: number;
  sex: "M" | "F";
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
}

export interface EmergencyCase {
  id: string;
  type: string;
  severity: Severity;
  status: CaseStatus;
  patient: PatientMedicalId;
  ambulanceUnit: string;
  etaMinutes: number;
  timeline: Record<TimelineStep, "complete" | "active" | "pending">;
  assignedTraumaBay?: string;
  surgeonNotified?: boolean;
}

export interface DashboardMetrics {
  activeEmergencies: number;
  icuBedsAvailable: number;
  icuBedsTotal: number;
  ambulancesTracked: number;
  avgResponseTimeMin: number;
}

export interface ResourceItem {
  id: string;
  label: string;
  current: number;
  total: number;
}

export interface BloodInventoryItem {
  type: string;
  units: number;
  minThreshold: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  onDuty: boolean;
}

export interface CriticalAlert {
  caseId: string;
  type: string;
  etaMinutes: number;
  patientSummary: string;
}
