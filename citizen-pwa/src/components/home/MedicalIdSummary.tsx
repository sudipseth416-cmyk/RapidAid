import { useQuery } from "@tanstack/react-query";
import { Droplets, AlertTriangle, Heart, Phone } from "lucide-react";
import { fetchMedicalIdSummary } from "../../lib/api";

const items = [
  { key: "bloodGroup", label: "Blood Group", icon: Droplets, color: "text-red-400" },
  { key: "allergies", label: "Allergies", icon: AlertTriangle, color: "text-amber-400" },
  { key: "condition", label: "Condition", icon: Heart, color: "text-pink-400" },
  { key: "emergencyContact", label: "Emergency", icon: Phone, color: "text-green-400" },
] as const;

export function MedicalIdSummary() {
  const { data } = useQuery({
    queryKey: ["medical-id-summary"],
    queryFn: fetchMedicalIdSummary,
  });

  function getValue(key: (typeof items)[number]["key"]): string {
    if (!data) return "…";
    if (key === "allergies") return data.allergies.join(", ") || "None";
    if (key === "emergencyContact") return data.emergencyContact.name;
    return String(data[key as keyof typeof data] ?? "—");
  }

  return (
    <div className="mt-6 px-4 pb-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
        Medical ID
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="rounded-xl bg-surface p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
                {label}
              </span>
            </div>
            <p className="truncate text-sm font-semibold">{getValue(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
