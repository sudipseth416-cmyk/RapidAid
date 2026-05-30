"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getSession } from "@/lib/auth/session";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export function useDashboardSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!SOCKET_URL) return;

    const session = getSession();
    if (!session?.token || session.user.role !== "hospital") return;

    const socket = io(SOCKET_URL, {
      auth: { token: session.token },
      transports: ["websocket"],
    });

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    socket.on("hospital:incoming_case", invalidate);
    socket.on("hospital:resource_update", invalidate);
    socket.on("hospital:case_closed", invalidate);
    socket.on("emergency:status_update", invalidate);
    socket.on("dashboard:resources", invalidate);
    socket.emit("hospital:subscribe");

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
