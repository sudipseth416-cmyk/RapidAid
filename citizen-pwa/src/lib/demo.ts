/** Returns true when demo mode is active (URL param or persisted flag). */
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("demo") === "1" ||
    localStorage.getItem("rapidaid-demo-mode") === "true"
  );
}

/** Persist demo flag when ?demo=1 is in the URL. */
export function initDemoModeFromUrl(): void {
  if (typeof window === "undefined") return;
  if (new URLSearchParams(window.location.search).get("demo") === "1") {
    localStorage.setItem("rapidaid-demo-mode", "true");
  }
}

/** Live socket only when URL is set, user is logged in, and not in demo mode. */
export function shouldUseLiveSocket(): boolean {
  return !isDemoMode() && !!localStorage.getItem("rapidaid_token");
}

export function getAuthToken(): string | null {
  return localStorage.getItem("rapidaid_token");
}
