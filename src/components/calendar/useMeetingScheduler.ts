import { useCallback, useState } from "react";
import type { AvailabilitySlot, MeetingRequest } from "../../types/calendar";

const uid = () => Math.random().toString(36).slice(2, 10);

export function useMeetingScheduler() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [requests, setRequests] = useState<MeetingRequest[]>([]);

  const addSlot = useCallback((date: string, startTime: string, endTime: string) => {
    setSlots((prev) => [...prev, { id: uid(), date, startTime, endTime, booked: false }]);
  }, []);

  const updateSlot = useCallback(
    (id: string, changes: Partial<Pick<AvailabilitySlot, "startTime" | "endTime">>) => {
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
    },
    []
  );

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    setRequests((prev) => prev.filter((r) => r.slotId !== id));
  }, []);

  const requestMeeting = useCallback(
    (
      slot: AvailabilitySlot,
      requesterName: string,
      requesterRole: "Investor" | "Entrepreneur",
      topic: string
    ) => {
      setRequests((prev) => [
        ...prev,
        {
          id: uid(),
          slotId: slot.id,
          requesterName,
          requesterRole,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          topic,
          status: "pending",
        },
      ]);
    },
    []
  );

  const respondToRequest = useCallback((id: string, status: "accepted" | "declined") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (status === "accepted") {
      setRequests((prevReqs) => {
        const req = prevReqs.find((r) => r.id === id);
        if (req) {
          setSlots((prevSlots) =>
            prevSlots.map((s) => (s.id === req.slotId ? { ...s, booked: true } : s))
          );
        }
        return prevReqs;
      });
    }
  }, []);

  const confirmedMeetings = requests.filter((r) => r.status === "accepted");

  return {
    slots,
    addSlot,
    updateSlot,
    removeSlot,
    requests,
    requestMeeting,
    respondToRequest,
    confirmedMeetings,
  };
}
