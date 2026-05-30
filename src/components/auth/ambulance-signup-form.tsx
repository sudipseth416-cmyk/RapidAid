"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendOtp, registerAmbulance } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { saveSession, appUrl } from "@/lib/auth/session";

const indianStates = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal",
];

const ambulanceTypes = [
  "Basic Life Support (BLS)",
  "Advanced Life Support (ALS)",
  "Patient Transport",
];

export function AmbulanceSignupForm() {
  const [state, setState] = useState("Maharashtra");
  const [ambulanceType, setAmbulanceType] = useState("Basic Life Support (BLS)");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(phone: string) {
    setError("");
    try {
      const res = await sendOtp(phone, "ambulance");
      setOtpSent(true);
      if (res.dev) setError("Dev mode: check backend terminal for OTP code.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to send OTP");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") ?? "");

    try {
      const session = await registerAmbulance({
        phone,
        otp,
        password: String(fd.get("password") ?? ""),
        unitId: String(fd.get("unitId") ?? ""),
        coordinates: [72.8777, 19.076],
        profile: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          registrationNumber: String(fd.get("reg") ?? ""),
          operator: String(fd.get("operator") ?? ""),
          license: String(fd.get("license") ?? ""),
          state,
          ambulanceType,
        },
      });
      saveSession(session);
      window.location.href = appUrl("/ambulance/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="driver-name">Driver Name</Label>
          <Input id="driver-name" name="name" placeholder="Amit Singh" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="driver-phone">Phone</Label>
          <div className="flex gap-2">
            <Input id="driver-phone" name="phone" type="tel" placeholder="+91…" required />
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                const form = (e.target as HTMLElement).closest("form");
                const phone = (form?.querySelector('[name="phone"]') as HTMLInputElement)?.value;
                if (phone) handleSendOtp(phone);
              }}
            >
              OTP
            </Button>
          </div>
        </div>
      </div>

      {otpSent && (
        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="reg-number">Registration Number</Label>
          <Input id="reg-number" name="reg" placeholder="MH-01-AB-1234" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitId">Unit ID</Label>
          <Input id="unitId" name="unitId" placeholder="AMB-MH-099" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amb-state">State</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger id="amb-state">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amb-type">Ambulance Type</Label>
          <Select value={ambulanceType} onValueChange={setAmbulanceType}>
            <SelectTrigger id="amb-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ambulanceTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading || !otpSent}>
        {loading ? "Registering…" : "Register Ambulance"}
      </Button>
    </form>
  );
}
