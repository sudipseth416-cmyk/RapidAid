import { useQuery } from "@tanstack/react-query";
import { Building2, Truck } from "lucide-react";
import { fetchNearbyHospital, fetchNearbyAmbulance } from "../../lib/api";

function StatusPill({ status }: { status: "available" | "limited" | "full" }) {
  const styles = {
    available: "bg-green-500/20 text-green-400",
    limited: "bg-amber-500/20 text-amber-400",
    full: "bg-red-500/20 text-red-400",
  };
  const labels = { available: "Available", limited: "Limited", full: "Full" };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function NearbyCards() {
  const { data: hospital } = useQuery({
    queryKey: ["nearby-hospital"],
    queryFn: fetchNearbyHospital,
    refetchInterval: 20_000,
  });

  const { data: ambulance } = useQuery({
    queryKey: ["nearby-ambulance"],
    queryFn: fetchNearbyAmbulance,
    refetchInterval: 15_000,
  });

  return (
    <div className="space-y-3 px-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
        Nearby
      </h2>

      <div className="rounded-xl bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
            <Building2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate font-semibold">{hospital?.name ?? "Loading…"}</p>
              {hospital && <StatusPill status={hospital.status} />}
            </div>
            <p className="mt-0.5 text-xs text-white/50">
              {hospital ? `${hospital.distanceKm} km away` : "—"} ·{" "}
              {hospital ? `${hospital.icuBeds} ICU beds` : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold">{ambulance?.unitId ?? "Loading…"}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  ambulance?.available
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {ambulance?.available ? "Available" : "Busy"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-white/50">
              {ambulance ? `${ambulance.distanceKm} km away` : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
