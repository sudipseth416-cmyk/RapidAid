"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSidebar } from "@/components/auth/auth-sidebar";
import { GoogleOAuthButton, AuthDivider } from "@/components/auth/google-oauth-button";

export default function SigninPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Sign in will connect to your backend API.");
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
          </p>

          <div className="mt-8">
            <GoogleOAuthButton />
            <AuthDivider />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@email.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
