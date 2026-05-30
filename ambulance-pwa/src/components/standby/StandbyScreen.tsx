import { Siren } from "lucide-react";
import { useDispatch } from "../../context/DispatchContext";
import { StandbyHeader } from "./StandbyHeader";
import { DispatchModal } from "./DispatchModal";

export function StandbyScreen() {
  const { onDuty, triggerTestDispatch } = useDispatch();

  return (
    <div className="flex min-h-dvh flex-col">
      <StandbyHeader />
      <DispatchModal />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {onDuty ? (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
              <Siren className="h-10 w-10 text-amber-light/40" />
            </div>
            <p className="mt-4 text-center text-base text-white/50">
              Standing by for dispatch…
            </p>
            <p className="mt-1 text-center text-label text-white/30">
              New alert incoming in ~6s
            </p>
          </>
        ) : (
          <p className="text-center text-base text-white/40">
            Go on duty to receive dispatch alerts
          </p>
        )}

        <button
          type="button"
          onClick={triggerTestDispatch}
          className="mt-8 min-h-touch text-label text-white/30 underline"
        >
          Simulate dispatch (dev)
        </button>
      </div>
    </div>
  );
}
