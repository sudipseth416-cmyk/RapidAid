"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardProviders } from "@/components/dashboard/providers";
import { DemoQueryProvider } from "@/components/demo/demo-query-provider";
import { enableDemoMode, isDemoMode } from "@/lib/demo/is-demo";

function Inner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const demo = isDemoMode(searchParams);

  useEffect(() => {
    if (demo) enableDemoMode();
  }, [demo]);

  if (demo) {
    return <DemoQueryProvider>{children}</DemoQueryProvider>;
  }
  return <DashboardProviders>{children}</DashboardProviders>;
}

export function DashboardDemoWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardProviders>{children}</DashboardProviders>}>
      <Inner>{children}</Inner>
    </Suspense>
  );
}
