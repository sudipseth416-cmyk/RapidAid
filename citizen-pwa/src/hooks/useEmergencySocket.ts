import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import type { TrackingUpdate } from "../types";
import { getAuthToken, shouldUseLiveSocket } from "../lib/demo";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string | undefined;

function useSimulatedTracking(
  active: boolean,
  onUpdate: (update: TrackingUpdate) => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);
  const etaRef = useRef(8);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      progressRef.current = 0;
      etaRef.current = 8;
      stepRef.current = 0;
      return;
    }

    intervalRef.current = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + 2.5);
      if (etaRef.current > 1) etaRef.current -= 0.15;
      if (progressRef.current > stepRef.current * 14 && stepRef.current < 7) {
        stepRef.current += 1;
      }
      onUpdate({
        etaMinutes: Math.max(1, Math.round(etaRef.current * 10) / 10),
        ambulanceProgress: progressRef.current,
        aiStep: stepRef.current,
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, onUpdate]);
}

export function useEmergencySocket(
  active: boolean,
  onUpdate: (update: TrackingUpdate) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const stableOnUpdate = useCallback((update: TrackingUpdate) => {
    onUpdateRef.current(update);
  }, []);

  const useSimulation = !SOCKET_URL || !shouldUseLiveSocket();

  useSimulatedTracking(useSimulation && active, stableOnUpdate);

  useEffect(() => {
    if (!active || useSimulation) return;

    const token = getAuthToken();
    if (!token) return;

    const socket = io(SOCKET_URL!, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on("tracking:update", (data: TrackingUpdate) => {
      stableOnUpdate(data);
    });

    socket.on("emergency:status_update", () => {
      // refresh handled by tracking updates
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [active, useSimulation, stableOnUpdate]);
}
