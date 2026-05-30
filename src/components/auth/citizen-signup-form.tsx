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
import { sendOtp, registerCitizen } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { saveSession, appUrl } from "@/lib/auth/session";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function CitizenSignupForm() {
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(phone: string) {
    setError("");
    try {
      const res = await sendOtp(phone, "citizen");
      setOtpSent(true);
      if (res.dev) {
        setError("Dev mode: check backend terminal for OTP code.");
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to send OTP");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const phone = String(fd.get("phone") ?? "");
    const payload = {
      phone,
      otp,
      password: String(fd.get("password") ?? ""),
      profile: {
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        city: String(fd.get("city") ?? ""),
        bloodGroup,
      },
      medicalId: {
        bloodGroup,
        allergies: [],
        medications: [],
        conditions: [],
        emergencyContacts: [
          {
            name: String(fd.get("ec-name") ?? ""),
            phone: String(fd.get("ec-phone") ?? ""),
            relation: "Emergency",
          },
        ],
      },
    };

    try {
      const session = await registerCitizen(payload);
      saveSession(session);
      window.location.href = appUrl("/citizen/");
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
          <Label htmlFor="citizen-name">Full Name</Label>
          <Input id="citizen-name" name="name" placeholder="Rajesh Kumar" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="citizen-phone">Phone Number</Label>
          <div className="flex gap-2">
            <Input
              id="citizen-phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
            />
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
          <Input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            maxLength={6}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="citizen-email">Email</Label>
        <Input id="citizen-email" name="email" type="email" placeholder="rajesh@email.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password (min 8)</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="citizen-blood">Blood Group</Label>
          <Select value={bloodGroup} onValueChange={setBloodGroup}>
            <SelectTrigger id="citizen-blood">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {bloodGroups.map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="citizen-city">City</Label>
          <Input id="citizen-city" name="city" placeholder="Mumbai" required />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Emergency Contact</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ec-name">Contact Name</Label>
            <Input id="ec-name" name="ec-name" placeholder="Priya Kumar" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ec-phone">Contact Phone</Label>
            <Input id="ec-phone" name="ec-phone" type="tel" placeholder="+91 98765 43211" required />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading || !otpSent}>
        {loading ? "Creating account…" : "Create Citizen Account"}
      </Button>
    </form>
  );
}
