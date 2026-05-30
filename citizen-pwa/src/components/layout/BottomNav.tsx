import { Siren, IdCard, MapPin, User } from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";
import type { NavTab } from "../../types";

const tabs: { id: NavTab; label: string; icon: typeof Siren }[] = [
  { id: "sos", label: "SOS", icon: Siren },
  { id: "medid", label: "Med ID", icon: IdCard },
  { id: "track", label: "Track", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { activeTab, setActiveTab, isActive } = useEmergency();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-app -translate-x-1/2 border-t border-white/10 bg-dark/95 backdrop-blur-lg safe-bottom">
      <div className="flex h-16 items-stretch">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isTrack = id === "track";
          const disabled = isTrack && !isActive;
          const active = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => setActiveTab(id)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "text-primary" : disabled ? "text-white/20" : "text-white/50"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${id === "sos" && active ? "fill-primary/20" : ""}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{label}</span>
              {id === "track" && isActive && (
                <span className="absolute top-2 h-1.5 w-1.5 rounded-full bg-green-400 animate-blink" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
