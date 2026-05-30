"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMetrics, fetchCases } from "@/lib/dashboard/api";
import type { EmergencyCase } from "@/lib/dashboard/types";
import { CriticalAlertBanner } from "@/components/dashboard/critical-alert-banner";
import { MetricCard } from "@/components/dashboard/metric-card";
import { IncomingCasesList } from "@/components/dashboard/overview/incoming-cases-list";
import { ResourceAvailability } from "@/components/dashboard/overview/resource-availability";
import { CaseTimeline } from "@/components/dashboard/case-timeline";
import { PatientMedicalCard } from "@/components/dashboard/patient-medical-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const responseTrend = [
  { hour: "06:00", min: 8.2 },
  { hour: "09:00", min: 7.1 },
  { hour: "12:00", min: 6.8 },
  { hour: "15:00", min: 6.2 },
  { hour: "18:00", min: 5.9 },
];

export function OverviewPage() {
  const { data: metrics } = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: fetchMetrics,
  });

  const { data: cases } = useQuery({
    queryKey: ["dashboard", "cases"],
    queryFn: fetchCases,
  });

  const defaultCase =
    cases?.find((c) => c.severity === "critical") ?? cases?.[0] ?? null;
  const [selected, setSelected] = useState<EmergencyCase | null>(null);
  const activeCase = selected ?? defaultCase;

  return (
    <>
      <CriticalAlertBanner />

      <div className="px-6 py-5">
        <header className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <h1 className="font-heading text-xl font-bold">Operations Overview</h1>
            <p className="text-sm text-muted-foreground">
              KEM Hospital Emergency Coordination · Live feed · 5s refresh
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {new Date().toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </header>

        <div className="grid grid-cols-4 gap-3">
          <MetricCard
            label="Active Emergencies"
            value={metrics?.activeEmergencies ?? "—"}
            alert={(metrics?.activeEmergencies ?? 0) > 2}
          />
          <MetricCard
            label="ICU Beds Available"
            value={
              metrics
                ? `${metrics.icuBedsAvailable}/${metrics.icuBedsTotal}`
                : "—"
            }
            sub="Real-time capacity"
          />
          <MetricCard
            label="Ambulances Tracked"
            value={metrics?.ambulancesTracked ?? "—"}
          />
          <MetricCard
            label="Avg Response Time"
            value={metrics ? `${metrics.avgResponseTimeMin} min` : "—"}
            sub="Last 24 hours"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <IncomingCasesList
              selectedId={activeCase?.id ?? null}
              onSelect={setSelected}
            />
            <ResourceAvailability />
          </div>

          <div className="space-y-5">
            {activeCase ? (
              <>
                <div className="border border-border bg-card p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Selected Case Timeline
                      </p>
                      <p className="font-mono text-sm font-semibold">{activeCase.id}</p>
                    </div>
                    <span className="text-sm font-semibold">{activeCase.type}</span>
                  </div>
                  <CaseTimeline timeline={activeCase.timeline} />
                </div>
                <PatientMedicalCard caseData={activeCase} />
              </>
            ) : (
              <div className="border border-border bg-card p-8 text-center text-muted-foreground">
                No active cases
              </div>
            )}

            <div className="border border-border bg-card p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Response Time Trend (24h)
              </p>
              <div className="h-40 min-h-[160px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minHeight={160}>
                  <LineChart data={responseTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="m" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="min"
                      stroke="#E24B4A"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
