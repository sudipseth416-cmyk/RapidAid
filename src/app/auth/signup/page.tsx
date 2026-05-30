"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthSidebar } from "@/components/auth/auth-sidebar";
import { GoogleOAuthButton, AuthDivider } from "@/components/auth/google-oauth-button";
import { CitizenSignupForm } from "@/components/auth/citizen-signup-form";
import { AmbulanceSignupForm } from "@/components/auth/ambulance-signup-form";
import { HospitalSignupForm } from "@/components/auth/hospital-signup-form";

const validRoles = ["citizen", "ambulance", "hospital"] as const;
type Role = (typeof validRoles)[number];

function SignupContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const defaultTab: Role = validRoles.includes(roleParam as Role)
    ? (roleParam as Role)
    : "citizen";

  return (
    <div className="flex min-h-screen">
      <AuthSidebar />

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="font-heading text-xl font-bold">
              Rapid<span className="text-primary">Aid</span>
            </Link>
          </div>

          <h1 className="font-heading text-3xl font-bold text-dark">Create your account</h1>
          <p className="mt-2 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>

          <div className="mt-8">
            <GoogleOAuthButton />
            <AuthDivider />

            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="citizen">Citizen</TabsTrigger>
                <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
                <TabsTrigger value="hospital">Hospital</TabsTrigger>
              </TabsList>

              <TabsContent value="citizen">
                <CitizenSignupForm />
              </TabsContent>
              <TabsContent value="ambulance">
                <AmbulanceSignupForm />
              </TabsContent>
              <TabsContent value="hospital">
                <HospitalSignupForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
