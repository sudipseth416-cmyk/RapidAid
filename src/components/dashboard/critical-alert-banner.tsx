"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { fetchCriticalAlerts } from "@/lib/dashboard/api";
import { Button } from "@/components/ui/button";

export function CriticalAlertBanner() {
  const { data: alerts } = useQuery({
    queryKey: ["dashboard", "critical-alerts"],
    queryFn: fetchCriticalAlerts,
  });

  if (!alerts?.length) return null;

  const primary = alerts[0];

  return (
    <div className="sticky top-0 z-30 border-b-2 border-primary bg-[#2a1515] px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Critical Incoming — {alerts.length} active
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              {primary.type} · Case {primary.caseId} · ETA {primary.etaMinutes} min
            </p>
            <p className="text-xs text-white/60">{primary.patientSummary}</p>
          </div>
        </div>
        <Button size="sm" variant="default" asChild>
          <Link href={`/dashboard/incoming?case=${primary.caseId}`}>View details</Link>
        </Button>
      </div>
    </div>
  );
}
