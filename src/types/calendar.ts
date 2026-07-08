export type MeetingStatus = "pending" | "accepted" | "declined";

export interface AvailabilitySlot {
  id: string;
  date: string; // ISO date, e.g. "2026-07-10"
  startTime: string; // "09:00"
  endTime: string; // "09:30"
  booked: boolean; // true once a request against this slot is accepted
}

export interface MeetingRequest {
  id: string;
  slotId: string;
  requesterName: string;
  requesterRole: "Investor" | "Entrepreneur";
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: MeetingStatus;
}
