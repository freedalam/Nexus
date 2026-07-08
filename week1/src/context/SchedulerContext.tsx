import { createContext, useContext, ReactNode } from "react";
import { useMeetingScheduler } from "../components/calendar/useMeetingScheduler";

type SchedulerContextValue = ReturnType<typeof useMeetingScheduler>;

const SchedulerContext = createContext<SchedulerContextValue | null>(null);

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const scheduler = useMeetingScheduler();
  return (
    <SchedulerContext.Provider value={scheduler}>
      {children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const ctx = useContext(SchedulerContext);
  if (!ctx) {
    throw new Error("useScheduler must be used inside a <SchedulerProvider>");
  }
  return ctx;
}
