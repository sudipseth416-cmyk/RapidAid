import { DashboardDemoWrapper } from "@/components/demo/dashboard-demo-wrapper";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SocketListener } from "@/components/dashboard/socket-listener";

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
      <SocketListener />
      <div className="min-h-screen min-w-[1200px] bg-[#e8e8ea] font-body">
        <DashboardSidebar />
        <main className="ml-[240px] min-h-screen">{children}</main>
      </div>
    </DashboardDemoWrapper>
  );
}
