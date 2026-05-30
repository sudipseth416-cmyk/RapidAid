"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import {
  DEMO_METRICS,
  DEMO_CRITICAL_ALERTS,
  DEMO_CASES,
  DEMO_RESOURCES,
  DEMO_BLOOD,
  DEMO_STAFF,
} from "@/lib/demo/mock-data";

function seedDemoData(client: QueryClient) {
  client.setQueryData(["dashboard", "metrics"], DEMO_METRICS);
  client.setQueryData(["dashboard", "critical-alerts"], DEMO_CRITICAL_ALERTS);
  client.setQueryData(["dashboard", "cases"], DEMO_CASES);
  client.setQueryData(["dashboard", "resources"], DEMO_RESOURCES);
  client.setQueryData(["dashboard", "blood"], DEMO_BLOOD);
  client.setQueryData(["dashboard", "staff"], DEMO_STAFF);
}

export function DemoQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchInterval: false,
          },
        },
      })
  );

  useEffect(() => {
    seedDemoData(client);
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
