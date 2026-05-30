export function isDemoMode(searchParams?: URLSearchParams | null): boolean {
  if (typeof window !== "undefined") {
    const params = searchParams ?? new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") return true;
    if (localStorage.getItem("rapidaid-demo-mode") === "true") return true;
  }
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return false; // env alone doesn't force; URL does
  return false;
}

export function enableDemoMode() {
  if (typeof window !== "undefined") {
    localStorage.setItem("rapidaid-demo-mode", "true");
  }
}
