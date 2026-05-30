import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { ActiveEmergency, NavTab, TrackingUpdate } from "../types";
import { AI_INSTRUCTIONS, generateCaseNumber } from "../lib/api";
import { useEmergencySocket } from "../hooks/useEmergencySocket";
import {
  loadEmergencyOffline,
  saveEmergencyOffline,
} from "../lib/offline-storage";
import { isDemoMode, initDemoModeFromUrl } from "../lib/demo";

const DEMO_EMERGENCY: ActiveEmergency = {
  caseNumber: "RA-DEMO01",
  etaMinutes: 4,
  hospitalName: "KEM Hospital",
  ambulanceUnitId: "AMB-MH-042",
  aiStep: 1,
  aiInstructions: AI_INSTRUCTIONS,
};

interface EmergencyContextValue {
  emergency: ActiveEmergency | null;
  isActive: boolean;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activateEmergency: () => void;
  cancelEmergency: () => void;
  tracking: TrackingUpdate;
  isOffline: boolean;
}

const EmergencyContext = createContext<EmergencyContextValue | null>(null);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const offline = loadEmergencyOffline();
  const [emergency, setEmergency] = useState<ActiveEmergency | null>(offline.emergency);
  const [activeTab, setActiveTab] = useState<NavTab>(
    (offline.activeTab as NavTab) || "sos"
  );
  const [tracking, setTracking] = useState<TrackingUpdate>(offline.tracking);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    initDemoModeFromUrl();
    if (isDemoMode()) {
      setEmergency(DEMO_EMERGENCY);
      setActiveTab("track");
      setTracking({ etaMinutes: 4, ambulanceProgress: 35, aiStep: 1 });
    }
  }, []);

  useEffect(() => {
    saveEmergencyOffline(emergency, tracking, activeTab);
  }, [emergency, tracking, activeTab]);

  const handleSocketUpdate = useCallback((update: TrackingUpdate) => {
    setTracking(update);
    setEmergency((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        etaMinutes: update.etaMinutes,
        aiStep: update.aiStep,
      };
    });
  }, []);

  useEmergencySocket(!!emergency && !isOffline, handleSocketUpdate);

  const activateEmergency = useCallback(() => {
    setEmergency({
      caseNumber: generateCaseNumber(),
      etaMinutes: 8,
      hospitalName: "KEM Hospital",
      ambulanceUnitId: "AMB-MH-042",
      aiStep: 0,
      aiInstructions: AI_INSTRUCTIONS,
    });
    setTracking({ etaMinutes: 8, ambulanceProgress: 0, aiStep: 0 });
    setActiveTab("track");
  }, []);

  const cancelEmergency = useCallback(() => {
    setEmergency(null);
    setTracking({ etaMinutes: 8, ambulanceProgress: 0, aiStep: 0 });
    setActiveTab("sos");
  }, []);

  return (
    <EmergencyContext.Provider
      value={{
        emergency,
        isActive: !!emergency,
        activeTab,
        setActiveTab,
        activateEmergency,
        cancelEmergency,
        tracking,
        isOffline,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error("useEmergency must be used within EmergencyProvider");
  return ctx;
}
