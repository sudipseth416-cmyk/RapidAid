import { useQuery } from "@tanstack/react-query";
import { MapPin, CheckCircle2, Radio } from "lucide-react";
import { fetchOperatorProfile } from "../../lib/api";
import { useDispatch } from "../../context/DispatchContext";

export function StandbyHeader() {
  const { data: profile } = useQuery({
    queryKey: ["operator"],
    queryFn: fetchOperatorProfile,
  });
  const { onDuty, setOnDuty, casesToday } = useDispatch();

  return (
    <header className="bg-amber-header px-4 pb-4 pt-3 safe-top">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-dark/60">
            {profile?.unitNumber ?? "…"}
          </p>
          <h1 className="font-heading text-xl font-bold text-dark">
            {profile?.driverName ?? "…"}
          </h1>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={onDuty}
          onClick={() => setOnDuty(!onDuty)}
          className={`flex min-h-touch items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            onDuty ? "bg-dark text-amber-light" : "bg-dark/20 text-dark"
          }`}
        >
          <Radio className={`h-4 w-4 ${onDuty ? "animate-blink" : ""}`} />
          {onDuty ? "On Duty" : "Off Duty"}
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-dark/10 p-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-dark/70" />
          <div className="min-w-0 flex-1">
            <p className="text-label font-medium text-dark/60">Current Location</p>
            <p className="text-base font-semibold text-dark">{profile?.location ?? "…"}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-4 border-t border-dark/10 pt-3">
          <div>
            <p className="text-label text-dark/50">Shift</p>
            <p className="flex items-center gap-1 text-base font-bold text-dark">
              <CheckCircle2 className="h-4 w-4 text-green-700" />
              {onDuty ? "Active" : "Off"}
            </p>
          </div>
          <div>
            <p className="text-label text-dark/50">Cases Today</p>
            <p className="text-base font-bold text-dark tabular-nums">{casesToday}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
