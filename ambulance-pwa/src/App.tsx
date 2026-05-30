import { DispatchProvider } from "./context/DispatchContext";
import { AppShell } from "./components/layout/AppShell";

export default function App() {
  return (
    <DispatchProvider>
      <AppShell />
    </DispatchProvider>
  );
}
