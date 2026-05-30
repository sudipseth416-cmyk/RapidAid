import { Phone, Building2, AlertTriangle, Droplets } from "lucide-react";
import { useDispatch } from "../../context/DispatchContext";
import { DispatchMap } from "../map/DispatchMap";
import { formatCountdown } from "../../lib/api";
import { ROUTES } from "../../types";

export function EnRouteScreen() {
  const { activeCase, ambulancePosition, pickUpPatient } = useDispatch();
  if (!activeCase) return null;

  const { dispatch, etaSeconds, distanceRemainingKm } = activeCase;
  const { patient } = dispatch;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar */}
      <header className="bg-dark px-4 pb-3 pt-3 safe-top">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-label font-semibold uppercase tracking-wider text-white/50">
              Navigating to patient
            </p>
            <p className="font-heading text-base font-bold">{activeCase.caseId}</p>
          </div>
          <div className="text-right">
            <p className="text-label text-white/50">ETA</p>
            <p className="font-heading text-3xl font-bold tabular-nums text-primary">
              {formatCountdown(etaSeconds)}
            </p>
          </div>
        </div>
      </header>

      {/* Map */}
      <DispatchMap
        ambulancePosition={ambulancePosition}
        destination={ROUTES.patient}
        origin={ROUTES.ambulanceStart}
        destinationType="patient"
        distanceKm={distanceRemainingKm}
        className="h-56"
      />

      {/* Scrollable middle content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Patient info */}
        <div className="rounded-xl bg-surface p-4">
          <p className="mb-3 text-label font-semibold uppercase tracking-wider text-white/40">
            Patient Info
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-red-400" />
              <div>
                <p className="text-label text-white/40">Blood</p>
                <p className="text-base font-bold">{patient.bloodGroup}</p>
              </div>
            </div>
            <div>
              <p className="text-label text-white/40">Age / Sex</p>
              <p className="text-base font-bold">
                {patient.age} / {patient.sex}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-label text-white/40">Conditions</p>
            <p className="text-base">{patient.conditions.join(", ")}</p>
          </div>
          {patient.allergies.length > 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-light/15 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-light" />
              <div>
                <p className="text-label font-semibold text-amber-light">Allergy Warning</p>
                <p className="text-base font-semibold">{patient.allergies.join(", ")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Hospital readiness */}
        <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <Building2 className="h-5 w-5 flex-shrink-0 text-green-400" />
          <div>
            <p className="text-base font-semibold text-green-300">
              KEM {activeCase.traumaBay} prepared
            </p>
            <p className="text-label text-green-400/70">Surgeon notified</p>
          </div>
        </div>
      </div>

      {/* Thumb zone */}
      <div className="thumb-zone">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => window.open("tel:+919876543210")}
            className="btn-outline gap-2 py-4"
          >
            <Phone className="h-5 w-5" />
            Call Patient
          </button>
          <button type="button" className="btn-outline gap-2 py-4">
            <Building2 className="h-5 w-5" />
            Hospital ETA
          </button>
        </div>
        <button
          type="button"
          onClick={pickUpPatient}
          className="btn-primary mt-3 w-full py-4 text-lg"
        >
          Patient Picked Up
        </button>
      </div>
    </div>
  );
}
