import { Building2, CheckCircle2 } from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";

export function HospitalNotification() {
  const { emergency } = useEmergency();
  if (!emergency) return null;

  return (
    <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl bg-surface p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500/15">
        <Building2 className="h-5 w-5 text-green-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
          <p className="text-sm font-semibold">KEM Emergency Team alerted</p>
        </div>
        <p className="text-xs text-white/50">Bed reserved · {emergency.hospitalName}</p>
      </div>
    </div>
  );
}
