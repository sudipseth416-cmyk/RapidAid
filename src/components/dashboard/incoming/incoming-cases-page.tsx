"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchCases } from "@/lib/dashboard/api";
import type { CaseFilter, EmergencyCase, Severity } from "@/lib/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseDetailSheet } from "./case-detail-sheet";
import { cn } from "@/lib/utils";

const filters: { id: CaseFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "stable", label: "Stable" },
  { id: "incoming", label: "Incoming" },
];

function severityBadge(s: Severity) {
  if (s === "critical") return "critical" as const;
  if (s === "urgent") return "urgent" as const;
  return "stable" as const;
}

export function IncomingCasesPage() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<CaseFilter>("all");
  const [selected, setSelected] = useState<EmergencyCase | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: cases } = useQuery({
    queryKey: ["dashboard", "cases"],
    queryFn: fetchCases,
  });

  const filtered = useMemo(() => {
    if (!cases) return [];
    switch (filter) {
      case "critical":
        return cases.filter((c) => c.severity === "critical");
      case "stable":
        return cases.filter((c) => c.severity === "stable");
      case "incoming":
        return cases.filter((c) => c.status === "incoming");
      default:
        return cases;
    }
  }, [cases, filter]);

  useEffect(() => {
    const caseId = searchParams.get("case");
    if (caseId && cases) {
      const found = cases.find((c) => c.id === caseId);
      if (found) {
        setSelected(found);
        setSheetOpen(true);
      }
    }
  }, [searchParams, cases]);

  function openCase(c: EmergencyCase) {
    setSelected(c);
    setSheetOpen(true);
  }

  return (
    <div className="px-6 py-5">
      <header className="mb-5 border-b border-border pb-4">
        <h1 className="font-heading text-xl font-bold">Incoming Cases</h1>
        <p className="text-sm text-muted-foreground">
          Full case registry · Select row for details
        </p>
      </header>

      <div className="mb-4 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              filter === f.id
                ? "border-dark bg-dark text-white"
                : "border-border bg-card text-muted-foreground hover:border-dark/30"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Ambulance</th>
              <th className="px-4 py-3">ETA</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => openCase(c)}
                className="cursor-pointer transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-mono text-xs font-medium">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.type}</td>
                <td className="px-4 py-3">
                  <Badge variant={severityBadge(c.severity)}>{c.severity}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.patient.name}, {c.patient.age}
                  {c.patient.sex} · {c.patient.bloodGroup}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{c.ambulanceUnit}</td>
                <td className="px-4 py-3 font-mono font-semibold tabular-nums text-primary">
                  {c.etaMinutes.toFixed(0)} min
                </td>
                <td className="px-4 py-3 capitalize">{c.status}</td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCase(c);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No cases match filter</p>
        )}
      </div>

      <CaseDetailSheet
        caseData={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
