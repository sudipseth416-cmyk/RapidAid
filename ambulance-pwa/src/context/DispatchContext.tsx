import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  DispatchPhase,
  DispatchAlert,
  ActiveCase,
  PatientVitals,
  RouteUpdate,
} from "../types";
import { ROUTES } from "../types";
import { MOCK_DISPATCH } from "../lib/api";
import { useRouteSocket } from "../hooks/useRouteSocket";

interface DispatchContextValue {
  phase: DispatchPhase;
  onDuty: boolean;
  setOnDuty: (v: boolean) => void;
  casesToday: number;
  incomingDispatch: DispatchAlert | null;
  activeCase: ActiveCase | null;
  vitals: PatientVitals;
  setVitals: (v: PatientVitals) => void;
  ambulancePosition: { lat: number; lng: number };
  acceptDispatch: () => void;
  declineDispatch: () => void;
  pickUpPatient: () => void;
  arriveAtHospital: () => void;
  triggerTestDispatch: () => void;
}

const DispatchContext = createContext<DispatchContextValue | null>(null);

const defaultVitals: PatientVitals = {
  pulse: "",
  bp: "",
  consciousness: "alert",
};

export function DispatchProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<DispatchPhase>("standby");
  const [onDuty, setOnDuty] = useState(true);
  const [casesToday, setCasesToday] = useState(3);
  const [incomingDispatch, setIncomingDispatch] = useState<DispatchAlert | null>(null);
  const [activeCase, setActiveCase] = useState<ActiveCase | null>(null);
  const [vitals, setVitals] = useState<PatientVitals>(defaultVitals);
  const [ambulancePosition, setAmbulancePosition] = useState(ROUTES.ambulanceStart);
  const [declinedIds, setDeclinedIds] = useState<Set<string>>(new Set());

  const handleRouteUpdate = useCallback(
    (update: RouteUpdate) => {
      setAmbulancePosition(update.ambulancePosition);
      setActiveCase((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          etaSeconds: update.etaSeconds,
          distanceRemainingKm: update.distanceRemainingKm,
          routeProgress: update.routeProgress,
          hospitalEtaSeconds:
            phase === "transporting"
              ? update.etaSeconds
              : prev.hospitalEtaSeconds,
        };
      });
    },
    [phase]
  );

  useRouteSocket(
    phase === "enroute-patient" || phase === "transporting",
    phase === "transporting" ? "transporting" : "enroute-patient",
    handleRouteUpdate
  );

  // Simulate incoming dispatch when on duty in standby (faster in demo)
  useEffect(() => {
    if (!onDuty || phase !== "standby" || incomingDispatch) return;

    const demo =
      typeof window !== "undefined" &&
      (new URLSearchParams(window.location.search).get("demo") === "1" ||
        localStorage.getItem("rapidaid-demo-mode") === "true");

    const delay = demo ? 1500 : 6000;
    const timer = setTimeout(() => {
      if (!declinedIds.has(MOCK_DISPATCH.id)) {
        setIncomingDispatch(MOCK_DISPATCH);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [onDuty, phase, incomingDispatch, declinedIds]);

  const acceptDispatch = useCallback(() => {
    if (!incomingDispatch) return;
    setActiveCase({
      caseId: incomingDispatch.caseId,
      dispatch: incomingDispatch,
      etaSeconds: 240,
      distanceRemainingKm: incomingDispatch.distanceKm,
      routeProgress: 0,
      hospitalName: "KEM Hospital",
      traumaBay: "Trauma Bay 2",
      hospitalEtaSeconds: 480,
    });
    setIncomingDispatch(null);
    setPhase("enroute-patient");
    setVitals(defaultVitals);
  }, [incomingDispatch]);

  const declineDispatch = useCallback(() => {
    if (incomingDispatch) {
      setDeclinedIds((prev) => new Set(prev).add(incomingDispatch.id));
    }
    setIncomingDispatch(null);
  }, [incomingDispatch]);

  const pickUpPatient = useCallback(() => {
    setPhase("transporting");
    setActiveCase((prev) =>
      prev
        ? {
            ...prev,
            etaSeconds: 360,
            distanceRemainingKm: 3.2,
            routeProgress: 0,
            hospitalEtaSeconds: 360,
          }
        : null
    );
    setAmbulancePosition(ROUTES.patient);
  }, []);

  const arriveAtHospital = useCallback(() => {
    setCasesToday((c) => c + 1);
    setActiveCase(null);
    setPhase("standby");
    setVitals(defaultVitals);
    setAmbulancePosition(ROUTES.ambulanceStart);
  }, []);

  const triggerTestDispatch = useCallback(() => {
    setIncomingDispatch(MOCK_DISPATCH);
  }, []);

  return (
    <DispatchContext.Provider
      value={{
        phase,
        onDuty,
        setOnDuty,
        casesToday,
        incomingDispatch,
        activeCase,
        vitals,
        setVitals,
        ambulancePosition,
        acceptDispatch,
        declineDispatch,
        pickUpPatient,
        arriveAtHospital,
        triggerTestDispatch,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatch() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useDispatch must be used within DispatchProvider");
  return ctx;
}
