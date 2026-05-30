import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  alert?: boolean;
}

export function MetricCard({ label, value, sub, alert }: MetricCardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-card px-4 py-3",
        alert && "border-l-4 border-l-primary"
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
