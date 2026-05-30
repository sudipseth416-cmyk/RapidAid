import { useState, useRef, useCallback } from "react";

const HOLD_DURATION_MS = 3000;

export function useHoldSOS(onActivate: () => void) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  const clear = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setHolding(false);
    setProgress(0);
  }, []);

  const startHold = useCallback(() => {
    startRef.current = Date.now();
    setHolding(true);
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setProgress(pct);
      if (elapsed >= HOLD_DURATION_MS) {
        clear();
        onActivate();
      }
    }, 50);
  }, [onActivate, clear]);

  const endHold = useCallback(() => {
    clear();
  }, [clear]);

  return { holding, progress, startHold, endHold };
}
