import { useEmergency } from "../../context/EmergencyContext";
import { useHoldSOS } from "../../hooks/useHoldSOS";

export function SOSButton() {
  const { activateEmergency, isActive } = useEmergency();
  const { holding, progress, startHold, endHold } = useHoldSOS(activateEmergency);

  if (isActive) return null;

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative flex h-[200px] w-[200px] items-center justify-center">
        {/* Pulsing rings */}
        <span className="absolute h-[140px] w-[140px] rounded-full border-2 border-primary/30 animate-pulse-ring" />
        <span
          className="absolute h-[140px] w-[140px] rounded-full border-2 border-primary/20 animate-pulse-ring"
          style={{ animationDelay: "0.6s" }}
        />
        <span
          className="absolute h-[140px] w-[140px] rounded-full border-2 border-primary/10 animate-pulse-ring"
          style={{ animationDelay: "1.2s" }}
        />

        {/* Hold progress ring */}
        {holding && (
          <svg className="absolute h-[148px] w-[148px] -rotate-90" viewBox="0 0 148 148">
            <circle
              cx="74"
              cy="74"
              r="70"
              fill="none"
              stroke="rgba(226,75,74,0.3)"
              strokeWidth="4"
            />
            <circle
              cx="74"
              cy="74"
              r="70"
              fill="none"
              stroke="#E24B4A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              className="transition-[stroke-dashoffset] duration-75"
            />
          </svg>
        )}

        <button
          type="button"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onContextMenu={(e) => e.preventDefault()}
          className={`relative z-10 flex h-[140px] w-[140px] select-none items-center justify-center rounded-full bg-primary font-heading text-2xl font-bold text-white shadow-lg shadow-primary/40 transition-transform ${
            holding ? "scale-95" : "animate-pulse-sos"
          }`}
          aria-label="Hold for 3 seconds to send SOS"
        >
          SOS
        </button>
      </div>
      <p className="mt-4 text-sm font-medium text-white/60">
        {holding ? "Keep holding…" : "Hold 3 seconds"}
      </p>
    </div>
  );
}
