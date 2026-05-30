import type { EmergencyCase, TimelineStep } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

const STEPS: { key: TimelineStep; label: string }[] = [
  { key: "sos", label: "SOS" },
  { key: "dispatch", label: "Dispatch" },
  { key: "hospital_alert", label: "Hospital Alert" },
  { key: "enroute", label: "En Route" },
  { key: "pickup", label: "Pickup" },
  { key: "arrival", label: "Arrival" },
];

export function CaseTimeline({ timeline }: { timeline: EmergencyCase["timeline"] }) {
  return (
    <div className="flex items-center justify-between gap-1">
      {STEPS.map((step, i) => {
        const state = timeline[step.key];
        return (
          <div key={step.key} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    state === "pending" ? "bg-border" : "bg-emerald-600"
                  )}
                />
              )}
              <div
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-bold",
                  state === "complete" && "border-emerald-600 bg-emerald-600 text-white",
                  state === "active" && "border-primary bg-primary text-white",
                  state === "pending" && "border-border bg-card text-muted-foreground"
                )}
              >
                {state === "complete" ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    timeline[STEPS[i + 1].key] === "pending" ? "bg-border" : "bg-emerald-600"
                  )}
                />
              )}
            </div>
            <span className="mt-1.5 text-center text-[9px] font-medium uppercase leading-tight text-muted-foreground">
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
