"use client";

import { useDashboardSocket } from "@/hooks/use-dashboard-socket";

export function SocketListener() {
  useDashboardSocket();
  return null;
}
