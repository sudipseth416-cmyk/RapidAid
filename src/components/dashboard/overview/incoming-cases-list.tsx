"use client";

import { useQuery } from "@tanstack/react-query";
import {
  HeartPulse,
  Car,
  Wind,
  Bone,
  type LucideIcon,
} from "lucide-react";
import { fetchCases } from "@/lib/dashboard/api";
import type { EmergencyCase, Severity } from "@/lib/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, LucideIcon> = {
  "Cardiac Arrest": HeartPulse,
  "Road Traffic Accident": Car,
  "Respiratory Distress": Wind,
  "Fall / Fracture": Bone,
};

function severityVariant(s: Severity) {
  if (s === "critical") return "critical" as const;
  if (s === "urgent") return "urgent" as const;
  return "stable" as const;
}

interface IncomingCasesListProps {
  selectedId: string | null;
  onSelect: (c: EmergencyCase) => void;
}

export function IncomingCasesList({ selectedId, onSelect }: IncomingCasesListProps) {
  const { data: cases } = useQuery({
    queryKey: ["dashboard", "cases"],
    queryFn: fetchCases,
  });

  const incoming = cases?.filter((c) => c.status !== "arrived" && c.status !== "closed") ?? [];

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          Incoming Cases
        </h2>
        <p className="text-xs text-muted-foreground">{incoming.length} active</p>
      </div>
      <ul className="max-h-[320px] divide-y divide-border overflow-y-auto">
        {incoming.map((c) => {
          const Icon = typeIcons[c.type] ?? HeartPulse;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                  selectedId === c.id && "bg-muted/80 border-l-2 border-l-primary"
                )}
              >
                <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                    <Badge variant={severityVariant(c.severity)}>{c.severity}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm font-semibold">{c.type}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.patient.name}, {c.patient.age}
                    {c.patient.sex} · {c.patient.bloodGroup}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold tabular-nums text-primary">
                    {c.etaMinutes.toFixed(0)}m
                  </p>
                  <p className="text-[10px] uppercase text-muted-foreground">ETA</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
