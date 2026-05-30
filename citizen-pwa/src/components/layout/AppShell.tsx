import { BottomNav } from "./BottomNav";
import { useEmergency } from "../../context/EmergencyContext";
import { HomeScreen } from "../home/HomeScreen";
import { EmergencyScreen } from "../emergency/EmergencyScreen";
import { MedicalIdScreen } from "../medical-id/MedicalIdScreen";
import { ProfileScreen } from "../profile/ProfileScreen";

export function AppShell() {
  const { activeTab, isActive } = useEmergency();

  const showEmergency = activeTab === "track" && isActive;

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app bg-dark">
      <main className="pb-20">
        {showEmergency ? (
          <EmergencyScreen />
        ) : activeTab === "medid" ? (
          <MedicalIdScreen />
        ) : activeTab === "profile" ? (
          <ProfileScreen />
        ) : (
          <HomeScreen />
        )}
      </main>
      <BottomNav />
    </div>
  );
}
