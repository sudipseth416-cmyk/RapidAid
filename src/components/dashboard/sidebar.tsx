"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Siren,
  Package,
  Map,
  History,
  Building2,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCases } from "@/lib/dashboard/api";

const opsNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, badge: true },
  { href: "/dashboard/incoming", label: "Incoming Cases", icon: Siren },
  { href: "/dashboard/resources", label: "Resource Management", icon: Package },
  { href: "/dashboard/dispatch", label: "Live Dispatch Map", icon: Map },
  { href: "/dashboard/history", label: "Case History", icon: History },
];

const hospitalNav = [
  { href: "/dashboard/hospital/info", label: "Hospital Info", icon: Building2 },
  { href: "/dashboard/hospital/staff", label: "Staff on Duty", icon: Users },
  { href: "/dashboard/hospital/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: cases } = useQuery({
    queryKey: ["dashboard", "cases"],
    queryFn: fetchCases,
  });

  const criticalCount =
    cases?.filter((c) => c.severity === "critical" && c.status !== "arrived").length ?? 0;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-white/10 bg-[#141414] text-white">
      <div className="border-b border-white/10 px-4 py-5">
        <Link href="/dashboard" className="font-heading text-lg font-bold tracking-tight">
          Rapid<span className="text-primary">Aid</span>
        </Link>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-white/40">
          Hospital Ops · KEM Mumbai
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Operations
        </p>
        <ul className="space-y-0.5">
          {opsNav.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge && criticalCount > 0 && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                      {criticalCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Hospital
        </p>
        <ul className="space-y-0.5">
          {hospitalNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-[11px] text-white/40">Coordinator: Dr. Ananya Sharma</p>
        <p className="text-[11px] font-mono text-emerald-500">● SYSTEM ONLINE</p>
      </div>
    </aside>
  );
}
