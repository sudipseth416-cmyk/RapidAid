import { EmergencyHeader } from "./EmergencyHeader";
import { TrackingBar } from "./TrackingBar";
import { MapView } from "./MapView";
import { AIAssistant } from "./AIAssistant";
import { HospitalNotification } from "./HospitalNotification";
import { EmergencyActions } from "./EmergencyActions";

export function EmergencyScreen() {
  return (
    <div className="min-h-full">
      <EmergencyHeader />
      <TrackingBar />
      <MapView />
      <AIAssistant />
      <HospitalNotification />
      <EmergencyActions />
    </div>
  );
}
