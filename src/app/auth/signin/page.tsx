"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSidebar } from "@/components/auth/auth-sidebar";
import { GoogleOAuthButton, AuthDivider } from "@/components/auth/google-oauth-button";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  saveSession,
  getPostLoginPath,
  appUrl,
  type UserRole,
} from "@/lib/auth/session";

const DEMO_ACCOUNTS = [
  { label: "Citizen (seed)", identifier: "+919876543210", password: "password123", role: "citizen" as const },
  { label: "Ambulance (seed)", identifier: "+919876543220", password: "password123", role: "ambulance" as const },
  { label: "Hospital (seed)", identifier: "emergency@kemhospital.dev", password: "password123", role: "hospital" as const },
];

export default function SigninPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin(id: string, pass: string, r?: UserRole) {
    setError("");
    setLoading(true);
    try {
      const session = await login(id, pass, r || undefined);
      saveSession(session);
      const path = getPostLoginPath(session.user.role);
      if (session.user.role === "citizen" || session.user.role === "ambulance") {
        window.location.href = appUrl(path);
      } else {
        router.push(path);
      }
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof TypeError
            ? "Cannot reach API. Start backend: cd backend && npm run dev"
            : "Sign in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doLogin(identifier, password, role || undefined);
  }

  return (
    <div className="flex min-h-screen">
      <AuthSidebar />

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="font-heading text-xl font-bold">
              Rapid<span className="text-primary">Aid</span>
            </Link>
          </div>

          <h1 className="font-heading text-3xl font-bold text-dark">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Get Started
            </Link>
            {" · "}
            <Link href="/demo" className="font-medium text-primary hover:underline">
              Try demo
            </Link>
          </p>

          <div className="mt-8">
            <GoogleOAuthButton />
            <AuthDivider />

            {error && (
              <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Sign in as</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole | "")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Any role</option>
                  <option value="citizen">Citizen</option>
                  <option value="ambulance">Ambulance</option>
                  <option value="hospital">Hospital</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or phone</Label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+91… or email@hospital.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                After running npm run seed in backend/
              </p>
              <ul className="mt-2 space-y-1">
                {DEMO_ACCOUNTS.map((a) => (
                  <li key={a.label}>
                    <button
                      type="button"
                      className="text-left text-sm text-primary hover:underline"
                      onClick={() => doLogin(a.identifier, a.password, a.role)}
                      disabled={loading}
                    >
                      {a.label}: {a.identifier}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
