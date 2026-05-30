import { AlertTriangle, Siren, User, MapPin } from "lucide-react";
import type { Priority } from "../../types";
import { useDispatch } from "../../context/DispatchContext";

const priorityStyles: Record<Priority, string> = {
  critical: "bg-primary text-white",
  urgent: "bg-orange-500 text-white",
  standard: "bg-blue-500 text-white",
};

export function DispatchModal() {
  const { incomingDispatch, acceptDispatch, declineDispatch } = useDispatch();
  if (!incomingDispatch) return null;

  const { patient } = incomingDispatch;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-app flex-col bg-dark animate-slide-up">
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 safe-top">
        <div className="flex animate-pulse-alert items-center justify-center rounded-2xl bg-amber-light/15 py-6">
          <Siren className="h-12 w-12 text-amber-light" />
        </div>

        <p className="mt-6 text-center text-label font-semibold uppercase tracking-widest text-amber-light">
          Incoming Dispatch
        </p>

        <h2 className="mt-2 text-center font-heading text-2xl font-bold">
          {incomingDispatch.emergencyType}
        </h2>

        <div className="mt-4 flex justify-center">
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase ${priorityStyles[incomingDispatch.priority]}`}
          >
            {incomingDispatch.priority}
          </span>
        </div>

        <div className="mt-6 space-y-3 rounded-xl bg-surface p-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-white/40" />
            <div>
              <p className="text-label text-white/50">Patient</p>
              <p className="text-base font-semibold">
                {patient.name}, {patient.age}
                {patient.sex}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-light" />
            <div>
              <p className="text-label text-white/50">Blood / Allergies</p>
              <p className="text-base font-semibold">
                {patient.bloodGroup} · {patient.allergies.join(", ") || "None"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-white/40" />
            <div>
              <p className="text-label text-white/50">Distance</p>
              <p className="text-base font-semibold">{incomingDispatch.distanceKm} km away</p>
            </div>
          </div>
        </div>
      </div>

      <div className="thumb-zone space-y-3">
        <button type="button" onClick={acceptDispatch} className="btn-amber w-full py-4 text-lg">
          Accept Dispatch
        </button>
        <button type="button" onClick={declineDispatch} className="btn-outline w-full py-4">
          Decline
        </button>
      </div>
    </div>
  );
}
