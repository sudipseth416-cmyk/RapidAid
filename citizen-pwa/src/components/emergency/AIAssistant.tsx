import { Bot, Volume2 } from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";

export function AIAssistant() {
  const { emergency } = useEmergency();
  if (!emergency) return null;

  const step = emergency.aiStep;
  const instruction = emergency.aiInstructions[step] ?? emergency.aiInstructions[0];

  return (
    <div className="mx-4 mt-4">
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
              <Bot className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-300">AI First-Aid Assistant</p>
              <p className="text-[10px] text-blue-400/60">Step {step + 1} of {emergency.aiInstructions.length}</p>
            </div>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
            aria-label="Voice instructions"
            onClick={() => {
              if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(instruction);
                utterance.rate = 0.9;
                speechSynthesis.speak(utterance);
              }
            }}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-blue-100/90">{instruction}</p>

        <div className="mt-3 flex gap-1">
          {emergency.aiInstructions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-blue-400" : "bg-blue-400/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
