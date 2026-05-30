import { useEmergency } from "../../context/EmergencyContext";

export function EmergencyHeader() {
  const { emergency } = useEmergency();
  if (!emergency) return null;

  const mins = Math.floor(emergency.etaMinutes);
  const secs = Math.round((emergency.etaMinutes - mins) * 60);

  return (
    <header className="bg-primary px-4 pb-4 pt-3 safe-top">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Emergency Active
          </p>
          <p className="font-heading text-lg font-bold">Case {emergency.caseNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/70">ETA</p>
          <p className="font-heading text-2xl font-bold tabular-nums">
            {mins}:{secs.toString().padStart(2, "0")}
          </p>
        </div>
      </div>
    </header>
  );
}
