import { useEffect } from "react";
import { DispatchProvider } from "./context/DispatchContext";
import { AppShell } from "./components/layout/AppShell";
import { initDemoModeFromUrl } from "./lib/demo";

export default function App() {
  useEffect(() => {
    initDemoModeFromUrl();
  }, []);

  return (
    <DispatchProvider>
      <AppShell />
    </DispatchProvider>
  );
}
