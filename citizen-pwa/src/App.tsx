import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { EmergencyProvider } from "./context/EmergencyContext";
import { AppShell } from "./components/layout/AppShell";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EmergencyProvider>
        <AppShell />
      </EmergencyProvider>
    </QueryClientProvider>
  );
}
