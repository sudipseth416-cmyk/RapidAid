"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardProviders } from "@/components/dashboard/providers";
import { DemoQueryProvider } from "@/components/demo/demo-query-provider";
import { enableDemoMode, isDemoMode } from "@/lib/demo/is-demo";
import { SocketListener } from "@/components/dashboard/socket-listener";

function Inner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const demo = isDemoMode(searchParams);

  useEffect(() => {
    if (demo) enableDemoMode();
  }, [demo]);

  if (demo) {
    return (
      <DemoQueryProvider>
        {children}
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-dark px-3 py-2 text-xs font-semibold text-white shadow-lg">
          DEMO MODE — mock data
        </div>
      </DemoQueryProvider>
    );
  }
  return (
    <>
      <SocketListener />
      <DashboardProviders>{children}</DashboardProviders>
    </>
  );
}

export function DashboardDemoWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardProviders>{children}</DashboardProviders>}>
      <Inner>{children}</Inner>
    </Suspense>
  );
}
