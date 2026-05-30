import { apiFetch } from "./client";
import type { AuthSession } from "@/lib/auth/session";

export async function login(identifier: string, password: string, role?: string) {
  return apiFetch<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password, role }),
  });
}

export async function sendOtp(phone: string, role: "citizen" | "ambulance") {
  return apiFetch<{ sent: boolean; dev?: boolean }>("/auth/otp/send", {
    method: "POST",
    body: JSON.stringify({ phone, role, purpose: "register" }),
  });
}

export async function verifyOtp(phone: string, code: string) {
  return apiFetch<{ verified: boolean }>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  });
}

export async function registerCitizen(payload: {
  phone: string;
  otp: string;
  password: string;
  profile: Record<string, unknown>;
  medicalId?: Record<string, unknown>;
}) {
  return apiFetch<AuthSession>("/auth/register/citizen", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerAmbulance(payload: {
  phone: string;
  otp: string;
  password: string;
  unitId: string;
  coordinates: [number, number];
  profile: Record<string, unknown>;
}) {
  return apiFetch<AuthSession>("/auth/register/ambulance", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerHospital(payload: {
  email: string;
  password: string;
  profile: Record<string, unknown>;
  coordinates: [number, number];
  registrationNumber?: string;
}) {
  return apiFetch<{ message: string; userId: string }>("/auth/register/hospital", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
