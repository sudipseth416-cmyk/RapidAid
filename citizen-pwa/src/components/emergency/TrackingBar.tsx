import { useEmergency } from "../../context/EmergencyContext";

export function TrackingBar() {
  const { tracking } = useEmergency();

  return (
    <div className="border-b border-white/10 bg-surface px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Ambulance en route</p>
          <p className="text-xs text-white/50">Live tracking active</p>
        </div>
        <div className="text-right">
          <p className="font-heading text-xl font-bold text-green-400 tabular-nums">
            {tracking.etaMinutes.toFixed(1)}
          </p>
          <p className="text-[10px] text-white/40">min</p>
        </div>
      </div>
    </div>
  );
}
