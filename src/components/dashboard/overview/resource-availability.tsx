"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchResources, getResourceColor } from "@/lib/dashboard/api";
import { Progress } from "@/components/ui/progress";

export function ResourceAvailability() {
  const { data: resources } = useQuery({
    queryKey: ["dashboard", "resources"],
    queryFn: fetchResources,
  });

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          Resource Availability
        </h2>
      </div>
      <div className="space-y-4 p-4">
        {resources?.map((r) => {
          const color = getResourceColor(r.current, r.total);
          return (
            <Progress
              key={r.id}
              label={r.label}
              value={r.current}
              max={r.total}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
}
