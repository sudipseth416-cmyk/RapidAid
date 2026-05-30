import { useState } from "react";
import { Phone, Users, XCircle } from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function EmergencyActions() {
  const { cancelEmergency } = useEmergency();
  const [showCancel, setShowCancel] = useState(false);

  return (
    <div className="mx-4 mt-4 space-y-3 pb-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => window.open("tel:+912212345678")}
          className="flex items-center justify-center gap-2 rounded-xl bg-surface py-3.5 text-sm font-semibold transition-colors active:bg-surface-light"
        >
          <Phone className="h-4 w-4 text-primary" />
          Call Hospital
        </button>
        <button
          type="button"
          onClick={() => window.open("tel:+919876543211")}
          className="flex items-center justify-center gap-2 rounded-xl bg-surface py-3.5 text-sm font-semibold transition-colors active:bg-surface-light"
        >
          <Users className="h-4 w-4 text-primary" />
          Alert Family
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowCancel(true)}
        className="flex w-full items-center justify-center gap-2 py-2 text-sm text-white/40 transition-colors active:text-white/60"
      >
        <XCircle className="h-4 w-4" />
        Cancel SOS
      </button>

      <ConfirmDialog
        open={showCancel}
        title="Cancel Emergency?"
        message="This will notify dispatch that help is no longer needed. Only cancel if you're safe."
        confirmLabel="Yes, Cancel SOS"
        cancelLabel="Keep Active"
        destructive
        onConfirm={() => {
          cancelEmergency();
          setShowCancel(false);
        }}
        onCancel={() => setShowCancel(false)}
      />
    </div>
  );
}
