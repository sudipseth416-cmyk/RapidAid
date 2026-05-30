import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { EmergencyProvider } from "./context/EmergencyContext";
import { AppShell } from "./components/layout/AppShell";
import { initDemoModeFromUrl } from "./lib/demo";

export default function App() {
  useEffect(() => {
    initDemoModeFromUrl();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EmergencyProvider>
        <AppShell />
      </EmergencyProvider>
    </QueryClientProvider>
  );
}
