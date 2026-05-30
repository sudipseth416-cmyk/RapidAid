export const TIMELINE_STEPS = [
  "sos",
  "dispatch",
  "hospital_alert",
  "enroute",
  "pickup",
  "arrival",
];

export function createTimelineEntry(step, status = "complete", meta = {}) {
  return {
    step,
    status,
    timestamp: new Date(),
    meta,
  };
}

export function initEmergencyTimeline() {
  return [createTimelineEntry("sos", "complete")];
}

export function appendTimeline(timeline, step, meta = {}) {
  const updated = timeline.map((t) =>
    t.step !== step && t.status === "active" ? { ...t, status: "complete" } : t
  );
  const exists = updated.find((t) => t.step === step);
  if (exists) {
    return updated.map((t) =>
      t.step === step ? { ...t, status: "complete", timestamp: new Date(), meta } : t
    );
  }
  return [...updated, createTimelineEntry(step, "complete", meta)];
}

export function activateTimelineStep(timeline, step, meta = {}) {
  const hasStep = timeline.some((t) => t.step === step);
  if (hasStep) {
    return timeline.map((t) =>
      t.step === step ? { ...t, status: "active", timestamp: new Date(), meta } : t
    );
  }
  return [...timeline, createTimelineEntry(step, "active", meta)];
}
