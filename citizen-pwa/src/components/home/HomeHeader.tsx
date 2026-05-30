import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { fetchUserProfile } from "../../lib/api";

export function HomeHeader() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  });

  return (
    <header className="bg-dark px-4 pb-4 pt-3 safe-top">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">Good evening,</p>
          <div className="flex items-center gap-1.5">
            <h1 className="font-heading text-xl font-bold">{profile?.name ?? "…"}</h1>
            <span className="flex items-center gap-1 text-xs text-white/40">
              <MapPin className="h-3 w-3" />
              {profile?.city ?? "…"}
            </span>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30">
          <span className="text-sm font-semibold text-primary">
            {profile?.avatarInitials ?? "?"}
          </span>
        </div>
      </div>
    </header>
  );
}
