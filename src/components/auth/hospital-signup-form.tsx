"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HospitalSignupForm() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Hospital account registration will connect to your backend API.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hospital-name">Hospital Name</Label>
          <Input id="hospital-name" placeholder="Apollo Hospital" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hospital-reg">Registration Number</Label>
          <Input id="hospital-reg" placeholder="HOS/MH/2024/001" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="admin-name">Admin Name</Label>
          <Input id="admin-name" placeholder="Dr. Ananya Sharma" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-designation">Designation</Label>
          <Input id="admin-designation" placeholder="Emergency Dept. Head" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hospital-email">Official Email</Label>
          <Input id="hospital-email" type="email" placeholder="emergency@hospital.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency-number">Emergency Number</Label>
          <Input id="emergency-number" type="tel" placeholder="+91 22 1234 5678" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hospital-city">City</Label>
          <Input id="hospital-city" placeholder="Delhi" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icu-beds">ICU Beds Available</Label>
          <Input id="icu-beds" type="number" min="0" placeholder="12" required />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Register Hospital
      </Button>
    </form>
  );
}
