import { Building2, Heart } from "lucide-react";
import { useDispatch } from "../../context/DispatchContext";
import { DispatchMap } from "../map/DispatchMap";
import { formatCountdown, CONSCIOUSNESS_OPTIONS } from "../../lib/api";
import { ROUTES } from "../../types";

export function TransportingScreen() {
  const { activeCase, ambulancePosition, vitals, setVitals, arriveAtHospital } = useDispatch();
  if (!activeCase) return null;

  const { dispatch, hospitalEtaSeconds, distanceRemainingKm } = activeCase;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-dark px-4 pb-3 pt-3 safe-top">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-label font-semibold uppercase tracking-wider text-white/50">
              Transporting to hospital
            </p>
            <p className="font-heading text-base font-bold">{activeCase.hospitalName}</p>
          </div>
          <div className="text-right">
            <p className="text-label text-white/50">Arrival ETA</p>
            <p className="font-heading text-3xl font-bold tabular-nums text-primary">
              {formatCountdown(hospitalEtaSeconds)}
            </p>
          </div>
        </div>
      </header>

      <DispatchMap
        ambulancePosition={ambulancePosition}
        destination={ROUTES.hospital}
        origin={ROUTES.patient}
        destinationType="hospital"
        distanceKm={distanceRemainingKm}
        className="h-48"
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Patient condition update */}
        <div className="rounded-xl bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <p className="text-label font-semibold uppercase tracking-wider text-white/40">
              Patient Condition — Handoff Notes
            </p>
          </div>
          <p className="mb-3 text-label text-white/50">
            {dispatch.patient.name} · {dispatch.emergencyType}
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="pulse" className="mb-1.5 block text-label font-medium text-white/60">
                Pulse (bpm)
              </label>
              <input
                id="pulse"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 88"
                value={vitals.pulse}
                onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                className="min-h-touch w-full rounded-xl border border-white/10 bg-surface-light px-4 text-base outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="bp" className="mb-1.5 block text-label font-medium text-white/60">
                Blood Pressure
              </label>
              <input
                id="bp"
                type="text"
                placeholder="e.g. 120/80"
                value={vitals.bp}
                onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                className="min-h-touch w-full rounded-xl border border-white/10 bg-surface-light px-4 text-base outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-label font-medium text-white/60">
                Consciousness Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CONSCIOUSNESS_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVitals({ ...vitals, consciousness: value })}
                    className={`min-h-touch rounded-xl text-base font-semibold transition-colors ${
                      vitals.consciousness === value
                        ? "bg-primary text-white"
                        : "bg-surface-light text-white/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <Building2 className="h-5 w-5 text-green-400" />
          <p className="text-base font-semibold text-green-300">
            {activeCase.traumaBay} ready for handoff
          </p>
        </div>
      </div>

      {/* Thumb zone — primary action */}
      <div className="thumb-zone">
        <button
          type="button"
          onClick={arriveAtHospital}
          className="btn-amber w-full py-5 text-lg"
        >
          Arrived at Hospital
        </button>
      </div>
    </div>
  );
}
