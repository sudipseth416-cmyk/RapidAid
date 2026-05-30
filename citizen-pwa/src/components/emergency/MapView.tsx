import { MapPin, Truck } from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";

export function MapView() {
  const { tracking } = useEmergency();
  const progress = tracking.ambulanceProgress;

  return (
    <div className="relative mx-4 mt-4 h-44 overflow-hidden rounded-xl bg-surface-light">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Route line */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path
          d="M 40 120 Q 120 80, 200 60 T 340 40"
          fill="none"
          stroke="rgba(226,75,74,0.3)"
          strokeWidth="3"
          strokeDasharray="6 4"
        />
        <path
          d="M 40 120 Q 120 80, 200 60 T 340 40"
          fill="none"
          stroke="#E24B4A"
          strokeWidth="3"
          strokeDasharray={`${progress * 3.5} 1000`}
        />
      </svg>

      {/* Destination pin */}
      <div className="absolute right-8 top-6 flex flex-col items-center">
        <MapPin className="h-6 w-6 text-primary drop-shadow-lg" fill="#E24B4A" />
        <span className="mt-0.5 text-[9px] font-medium text-white/60">You</span>
      </div>

      {/* Ambulance icon — moves along route */}
      <div
        className="absolute transition-all duration-1000 ease-linear"
        style={{
          left: `${12 + progress * 0.72}%`,
          top: `${78 - progress * 0.38}%`,
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40">
          <Truck className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="absolute bottom-2 left-3 rounded-md bg-dark/80 px-2 py-1 text-[10px] text-white/60">
        Map view · Live
      </div>
    </div>
  );
}
