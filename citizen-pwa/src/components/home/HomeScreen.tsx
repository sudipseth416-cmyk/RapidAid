import { HomeHeader } from "./HomeHeader";
import { SOSButton } from "./SOSButton";
import { NearbyCards } from "./NearbyCards";
import { MedicalIdSummary } from "./MedicalIdSummary";

export function HomeScreen() {
  return (
    <div className="min-h-full">
      <HomeHeader />
      <SOSButton />
      <NearbyCards />
      <MedicalIdSummary />
    </div>
  );
}
