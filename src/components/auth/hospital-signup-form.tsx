"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerHospital } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function HospitalSignupForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await registerHospital({
        email: String(fd.get("email") ?? ""),
        password: String(fd.get("password") ?? ""),
        registrationNumber: String(fd.get("hospital-reg") ?? ""),
        coordinates: [72.854, 19.021],
        profile: {
          hospitalName: String(fd.get("hospital-name") ?? ""),
          hospitalRegistrationNumber: String(fd.get("hospital-reg") ?? ""),
          adminName: String(fd.get("admin-name") ?? ""),
          adminDesignation: String(fd.get("admin-designation") ?? ""),
          email: String(fd.get("email") ?? ""),
          emergencyNumber: String(fd.get("emergency-number") ?? ""),
          city: String(fd.get("hospital-city") ?? ""),
          icuBeds: Number(fd.get("icu-beds") ?? 12),
        },
      });
      setSuccess(res.message);
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
      {success && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hospital-name">Hospital Name</Label>
          <Input id="hospital-name" name="hospital-name" placeholder="KEM Hospital" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hospital-reg">Registration Number</Label>
          <Input id="hospital-reg" name="hospital-reg" placeholder="HOS/MH/2024/001" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="admin-name">Admin Name</Label>
          <Input id="admin-name" name="admin-name" placeholder="Dr. Ananya Sharma" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-designation">Designation</Label>
          <Input
            id="admin-designation"
            name="admin-designation"
            placeholder="Emergency Dept. Head"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hospital-email">Official Email</Label>
          <Input
            id="hospital-email"
            name="email"
            type="email"
            placeholder="emergency@hospital.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" minLength={8} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="emergency-number">Emergency Number</Label>
          <Input id="emergency-number" name="emergency-number" type="tel" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hospital-city">City</Label>
          <Input id="hospital-city" name="hospital-city" placeholder="Mumbai" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icu-beds">ICU Beds Available</Label>
        <Input id="icu-beds" name="icu-beds" type="number" min={0} defaultValue={12} required />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Submitting…" : "Register Hospital"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Requires email verification and manual approval before dashboard access.
      </p>
    </form>
  );
}
