import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import type { RouteUpdate, LatLng } from "../types";
import { ROUTES } from "../types";
import { interpolateRoute } from "../lib/api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string | undefined;

interface SimOptions {
  active: boolean;
  destination: LatLng;
  start: LatLng;
  onUpdate: (update: RouteUpdate) => void;
}

function useSimulatedRoute({ active, destination, start, onUpdate }: SimOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      progressRef.current = 0;
      return;
    }

    intervalRef.current = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + 3);
      const totalDist = 2.5;
      const remaining = totalDist * (1 - progressRef.current / 100);
      const eta = Math.max(0, Math.round(remaining * 60));

      onUpdate({
        etaSeconds: eta,
        distanceRemainingKm: Math.round(remaining * 10) / 10,
        routeProgress: progressRef.current,
        ambulancePosition: interpolateRoute(start, destination, progressRef.current),
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, destination, start, onUpdate]);
}

export function useRouteSocket(
  active: boolean,
  phase: "enroute-patient" | "transporting",
  onUpdate: (update: RouteUpdate) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const stableOnUpdate = useCallback((update: RouteUpdate) => {
    onUpdateRef.current(update);
  }, []);

  const start = ROUTES.ambulanceStart;
  const destination = phase === "enroute-patient" ? ROUTES.patient : ROUTES.hospital;
  const useSimulation = !SOCKET_URL;

  useSimulatedRoute({
    active: useSimulation && active,
    destination,
    start: phase === "transporting" ? ROUTES.patient : start,
    onUpdate: stableOnUpdate,
  });

  useEffect(() => {
    if (!active || useSimulation) return;

    const socket = io(SOCKET_URL!, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("route:update", (data: RouteUpdate) => stableOnUpdate(data));
    socket.emit("dispatch:subscribe", { phase });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [active, phase, useSimulation, stableOnUpdate]);
}
