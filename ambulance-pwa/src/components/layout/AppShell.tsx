import { useDispatch } from "../../context/DispatchContext";
import { StandbyScreen } from "../standby/StandbyScreen";
import { EnRouteScreen } from "../enroute/EnRouteScreen";
import { TransportingScreen } from "../transporting/TransportingScreen";

export function AppShell() {
  const { phase } = useDispatch();

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app bg-dark">
      {phase === "standby" && <StandbyScreen />}
      {phase === "enroute-patient" && <EnRouteScreen />}
      {phase === "transporting" && <TransportingScreen />}
    </div>
  );
}
