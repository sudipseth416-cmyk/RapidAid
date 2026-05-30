import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Shield } from "lucide-react";
import { fetchUserProfile, fetchMedicalIdSummary } from "../../lib/api";

export function ProfileScreen() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  });

  const { data: medId } = useQuery({
    queryKey: ["medical-id-summary"],
    queryFn: fetchMedicalIdSummary,
  });

  return (
    <div className="min-h-full">
      <header className="px-4 pb-4 pt-3 safe-top">
        <h1 className="font-heading text-xl font-bold">Profile</h1>
      </header>

      <div className="px-4">
        <div className="flex flex-col items-center rounded-xl bg-surface py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/10">
            <span className="font-heading text-2xl font-bold text-primary">
              {profile?.avatarInitials ?? "?"}
            </span>
          </div>
          <h2 className="mt-4 font-heading text-xl font-bold">{profile?.name ?? "…"}</h2>
          <div className="mt-1 flex items-center gap-1 text-sm text-white/50">
            <MapPin className="h-3.5 w-3.5" />
            {profile?.city ?? "…"}
          </div>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
            <Shield className="h-3 w-3" />
            Verified Citizen
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <InfoRow icon={Phone} label="Emergency Contact" value={medId?.emergencyContact.phone ?? "—"} />
          <InfoRow icon={Mail} label="Blood Group" value={medId?.bloodGroup ?? "—"} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface p-4">
      <Icon className="h-4 w-4 text-white/40" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
