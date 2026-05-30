"use client";

import type { EmergencyCase } from "@/lib/dashboard/types";
import { CaseTimeline } from "@/components/dashboard/case-timeline";
import { PatientMedicalCard } from "@/components/dashboard/patient-medical-card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CaseDetailSheetProps {
  caseData: EmergencyCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CaseDetailSheet({ caseData, open, onOpenChange }: CaseDetailSheetProps) {
  if (!caseData) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono">{caseData.id}</SheetTitle>
          <div className="flex gap-2 pt-2">
            <Badge variant="critical">{caseData.severity}</Badge>
            <Badge variant="outline">{caseData.status}</Badge>
          </div>
        </SheetHeader>
        <div className="space-y-6 p-6 pt-2">
          <div>
            <p className="text-sm font-semibold">{caseData.type}</p>
            <p className="text-xs text-muted-foreground">
              Ambulance {caseData.ambulanceUnit} · ETA {caseData.etaMinutes} min
            </p>
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Case Timeline
            </p>
            <CaseTimeline timeline={caseData.timeline} />
          </div>
          <PatientMedicalCard caseData={caseData} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
