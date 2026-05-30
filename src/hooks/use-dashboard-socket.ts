"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export function useDashboardSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!SOCKET_URL) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    socket.on("case:update", invalidate);
    socket.on("resource:update", invalidate);
    socket.on("metrics:update", invalidate);
    socket.emit("hospital:subscribe");

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
