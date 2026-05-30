import { DashboardDemoWrapper } from "@/components/demo/dashboard-demo-wrapper";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export const metadata = {
  title: "RapidAid Hospital Operations",
  description: "Emergency coordination dashboard for hospital coordinators",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardDemoWrapper>
      <div className="min-h-screen min-w-[1200px] bg-[#e8e8ea] font-body">
        <DashboardSidebar />
        <main className="ml-[240px] min-h-screen">{children}</main>
      </div>
    </DashboardDemoWrapper>
  );
}
