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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function CitizenSignupForm() {
  const [bloodGroup, setBloodGroup] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Citizen account registration will connect to your backend API.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="citizen-name">Full Name</Label>
          <Input id="citizen-name" placeholder="Rajesh Kumar" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="citizen-phone">Phone Number</Label>
          <Input id="citizen-phone" type="tel" placeholder="+91 98765 43210" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="citizen-email">Email</Label>
        <Input id="citizen-email" type="email" placeholder="rajesh@email.com" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="citizen-blood">Blood Group</Label>
          <Select value={bloodGroup} onValueChange={setBloodGroup} required>
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
          <Input id="citizen-city" placeholder="Mumbai" required />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Emergency Contact</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ec-name">Contact Name</Label>
            <Input id="ec-name" placeholder="Priya Kumar" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ec-phone">Contact Phone</Label>
            <Input id="ec-phone" type="tel" placeholder="+91 98765 43211" required />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Create Citizen Account
      </Button>
    </form>
  );
}
