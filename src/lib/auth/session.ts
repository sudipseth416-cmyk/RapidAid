export type UserRole = "citizen" | "ambulance" | "hospital";

export interface AuthUser {
  id: string;
  role: UserRole;
  profile: Record<string, unknown>;
  isVerified?: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = "rapidaid_token";
const USER_KEY = "rapidaid_user";

export function saveSession(session: AuthSession) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("rapidaid-demo-mode");
}

export function getSession(): AuthSession | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) as AuthUser };
  } catch {
    return null;
  }
}

export function getPostLoginPath(role: UserRole, demo = false): string {
  const q = demo ? "?demo=1" : "";
  switch (role) {
    case "citizen":
      return `/citizen${q}`;
    case "ambulance":
      return `/ambulance${q}`;
    case "hospital":
      return `/dashboard${q}`;
    default:
      return "/";
  }
}

/** Build URL for Vite PWAs served under /citizen/ and /ambulance/ */
export function appUrl(path: string): string {
  if (path.startsWith("/ambulance")) {
    const rest = path.replace(/^\/ambulance\/?/, "") || "";
    if (!rest) return "/ambulance/";
    if (rest.startsWith("?")) return `/ambulance${rest}`;
    return `/ambulance/${rest}`;
  }
  if (path.startsWith("/citizen")) {
    const rest = path.replace(/^\/citizen\/?/, "") || "";
    if (!rest) return "/citizen/";
    if (rest.startsWith("?")) return `/citizen${rest}`;
    return `/citizen/${rest}`;
  }
  if (path.startsWith("?")) return `/citizen${path}`;
  return `/citizen/${path.replace(/^\//, "")}`;
}
