import { Suspense } from "react";
import { IncomingCasesPage } from "@/components/dashboard/incoming/incoming-cases-page";

export default function IncomingPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading cases…</div>}>
      <IncomingCasesPage />
    </Suspense>
  );
}
