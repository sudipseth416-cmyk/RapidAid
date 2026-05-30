export type DispatchPhase = "standby" | "enroute-patient" | "transporting";

export type Priority = "critical" | "urgent" | "standard";

export interface OperatorProfile {
  unitNumber: string;
  driverName: string;
  onDuty: boolean;
  location: string;
  casesToday: number;
}

export interface PatientInfo {
  name: string;
  age: number;
  sex: "M" | "F";
  bloodGroup: string;
  conditions: string[];
  allergies: string[];
}

export interface DispatchAlert {
  id: string;
  caseId: string;
  emergencyType: string;
  priority: Priority;
  patient: PatientInfo;
  distanceKm: number;
}

export interface ActiveCase {
  caseId: string;
  dispatch: DispatchAlert;
  etaSeconds: number;
  distanceRemainingKm: number;
  routeProgress: number;
  hospitalName: string;
  traumaBay: string;
  hospitalEtaSeconds: number;
}

export interface PatientVitals {
  pulse: string;
  bp: string;
  consciousness: "alert" | "verbal" | "pain" | "unresponsive";
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteUpdate {
  etaSeconds: number;
  distanceRemainingKm: number;
  routeProgress: number;
  ambulancePosition: LatLng;
}

export const ROUTES = {
  ambulanceStart: { lat: 19.076, lng: 72.8777 } as LatLng,
  patient: { lat: 19.082, lng: 72.885 } as LatLng,
  hospital: { lat: 19.021, lng: 72.854 } as LatLng,
};
