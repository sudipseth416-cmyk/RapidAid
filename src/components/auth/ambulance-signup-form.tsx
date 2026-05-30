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

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
];

const ambulanceTypes = ["Basic Life Support (BLS)", "Advanced Life Support (ALS)", "Patient Transport", "Neonatal"];

export function AmbulanceSignupForm() {
  const [state, setState] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Ambulance account registration will connect to your backend API.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="driver-name">Driver Name</Label>
          <Input id="driver-name" placeholder="Amit Singh" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="driver-phone">Phone Number</Label>
          <Input id="driver-phone" type="tel" placeholder="+91 98765 43210" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="reg-number">Registration Number</Label>
          <Input id="reg-number" placeholder="MH-01-AB-1234" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="operator">Operator / Service</Label>
          <Input id="operator" placeholder="City Ambulance Services" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="license">Driving License Number</Label>
          <Input id="license" placeholder="DL-0123456789" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amb-state">State</Label>
          <Select value={state} onValueChange={setState} required>
            <SelectTrigger id="amb-state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amb-type">Ambulance Type</Label>
          <Select value={ambulanceType} onValueChange={setAmbulanceType} required>
            <SelectTrigger id="amb-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ambulanceTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amb-email">Email</Label>
          <Input id="amb-email" type="email" placeholder="driver@ambulance.com" required />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Register Ambulance
      </Button>
    </form>
  );
}
