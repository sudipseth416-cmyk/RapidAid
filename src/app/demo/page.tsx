"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Siren,
  Truck,
  Building2,
  LayoutDashboard,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { enableDemoMode } from "@/lib/demo/is-demo";
import {
  DEMO_ACTIVE_EMERGENCY,
  DEMO_AMBULANCES,
  DEMO_HOSPITALS,
} from "@/lib/demo/mock-data";

export default function DemoPage() {
  useEffect(() => {
    enableDemoMode();
  }, []);

  return (
    <div className="min-h-screen bg-[#e8e8ea] font-body">
      <header className="border-b border-border bg-dark px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Hackathon Demo
            </p>
            <h1 className="font-heading text-2xl font-bold">
              Rapid<span className="text-primary">Aid</span> Live Walkthrough
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Pre-seeded data · No signup required
            </p>
          </div>
          <Badge variant="critical" className="text-sm">
            1 Active Emergency
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="mb-8 border border-primary/30 bg-[#2a1515] p-5 text-white">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold uppercase tracking-wide text-primary text-sm">
                Active Emergency
              </p>
              <p className="mt-1 text-lg font-bold">
                {DEMO_ACTIVE_EMERGENCY.type} · {DEMO_ACTIVE_EMERGENCY.id}
              </p>
              <p className="text-sm text-white/70">
                {DEMO_ACTIVE_EMERGENCY.patient.name}, {DEMO_ACTIVE_EMERGENCY.patient.age}
                {DEMO_ACTIVE_EMERGENCY.patient.sex} · {DEMO_ACTIVE_EMERGENCY.patient.bloodGroup} ·
                ETA {DEMO_ACTIVE_EMERGENCY.etaMinutes} min · {DEMO_ACTIVE_EMERGENCY.ambulanceUnit}
              </p>
            </div>
          </div>
        </section>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Citizen App",
              desc: "SOS, live tracking, Medical ID (PWA)",
              href: "/citizen?demo=1",
              icon: Siren,
              color: "bg-primary/10 text-primary",
            },
            {
              title: "Ambulance App",
              desc: "Dispatch, navigation, patient pickup (PWA)",
              href: "/ambulance?demo=1",
              icon: Truck,
              color: "bg-amber-100 text-amber-800",
            },
            {
              title: "Hospital Dashboard",
              desc: "Ops overview, cases, resources",
              href: "/dashboard?demo=1",
              icon: LayoutDashboard,
              color: "bg-emerald-100 text-emerald-800",
            },
          ].map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${app.color}`}>
                <app.icon className="h-5 w-5" />
              </div>
              <h2 className="font-heading font-bold">{app.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{app.desc}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                Launch demo <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                <Truck className="h-4 w-4" /> Ambulance Units (3)
              </h3>
            </div>
            <ul className="divide-y divide-border">
              {DEMO_AMBULANCES.map((a) => (
                <li key={a.unitId} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-mono font-semibold">{a.unitId}</p>
                    <p className="text-muted-foreground">{a.driver}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={a.status === "available" ? "stable" : "urgent"}>
                      {a.status}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{a.distanceKm} km</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                <Building2 className="h-4 w-4" /> Hospitals (2)
              </h3>
            </div>
            <ul className="divide-y divide-border">
              {DEMO_HOSPITALS.map((h) => (
                <li key={h.name} className="px-4 py-3 text-sm">
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-muted-foreground">{h.city}</p>
                  <p className="mt-1 text-xs">
                    ICU {h.icuBeds}/{h.icuTotal} · Trauma {h.traumaBays}/{h.traumaTotal} ·{" "}
                    {h.activeCases} active cases
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/">Marketing site</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard?demo=1">Open hospital dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
