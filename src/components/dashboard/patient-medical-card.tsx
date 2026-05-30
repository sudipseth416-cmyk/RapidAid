"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import type { EmergencyCase } from "@/lib/dashboard/types";
import { assignTraumaBay, notifySurgeon } from "@/lib/dashboard/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PatientMedicalCardProps {
  caseData: EmergencyCase;
}

export function PatientMedicalCard({ caseData }: PatientMedicalCardProps) {
  const queryClient = useQueryClient();
  const { patient } = caseData;

  const assignMutation = useMutation({
    mutationFn: () => assignTraumaBay(caseData.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  });

  const notifyMutation = useMutation({
    mutationFn: () => notifySurgeon(caseData.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  });

  return (
    <div className="border border-border bg-card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Patient Medical ID
      </p>
      <p className="mt-2 font-heading text-lg font-bold">{patient.name}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Blood Group</dt>
          <dd className="font-mono font-semibold">{patient.bloodGroup}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Age / Sex</dt>
          <dd className="font-semibold">
            {patient.age} / {patient.sex}
          </dd>
        </div>
      </dl>
      {patient.conditions.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Conditions: {patient.conditions.join(", ")}
        </p>
      )}
      {patient.allergies.length > 0 && (
        <div className="mt-3 flex items-start gap-2 border border-amber-500/40 bg-amber-50 px-3 py-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
          <div>
            <p className="text-xs font-semibold uppercase text-amber-800">Allergy Warning</p>
            <p className="text-sm font-semibold text-amber-900">
              {patient.allergies.join(", ")}
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {caseData.assignedTraumaBay && (
          <Badge variant="muted">{caseData.assignedTraumaBay}</Badge>
        )}
        {caseData.surgeonNotified && (
          <Badge variant="stable">Surgeon Notified</Badge>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant="dark"
          disabled={!!caseData.assignedTraumaBay || assignMutation.isPending}
          onClick={() => assignMutation.mutate()}
        >
          Assign Trauma Bay
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={caseData.surgeonNotified || notifyMutation.isPending}
          onClick={() => notifyMutation.mutate()}
        >
          Notify Surgeon
        </Button>
      </div>
    </div>
  );
}
