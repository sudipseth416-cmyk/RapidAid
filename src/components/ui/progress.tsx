import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  color?: "green" | "amber" | "red" | "primary";
  className?: string;
  label?: string;
}

const colorMap = {
  green: "bg-emerald-600",
  amber: "bg-amber-500",
  red: "bg-primary",
  primary: "bg-primary",
};

export function Progress({ value, max = 100, color = "primary", className, label }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono font-medium tabular-nums">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-sm bg-muted">
        <div
          className={cn("h-full transition-all duration-500", colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
