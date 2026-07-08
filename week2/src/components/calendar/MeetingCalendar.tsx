import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useScheduler } from "../../context/SchedulerContext";
import type { AvailabilitySlot } from "../../types/calendar";

export default function MeetingCalendar() {
  const {
    slots,
    addSlot,
    updateSlot,
    removeSlot,
    requests,
    requestMeeting,
    respondToRequest,
    confirmedMeetings,
  } = useScheduler();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("09:30");
  const [requesterName, setRequesterName] = useState("");
  const [topic, setTopic] = useState("");
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const daySlots = slots.filter((s) => s.date === dateKey);

  const handleAddSlot = () => {
    if (!start || !end) return;
    addSlot(dateKey, start, end);
  };

  const handleRequest = (slot: AvailabilitySlot) => {
    if (!requesterName || !topic) return;
    requestMeeting(slot, requesterName, "Investor", topic);
    setRequesterName("");
    setTopic("");
  };

  return (
    <div className="grid-dashboard container-responsive py-6">
      {/* Calendar + Availability */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="font-heading text-xl font-semibold text-primary-700 mb-4">
          Meeting Scheduler
        </h2>

        <Calendar
          onChange={(v) => setSelectedDate(v as Date)}
          value={selectedDate}
          className="rounded-xl border-none w-full"
        />

        <div className="mt-5">
          <h3 className="font-medium text-sm text-slate-500 mb-2">
            Add availability — {format(selectedDate, "PPP")}
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm"
            />
            <span className="text-slate-400">to</span>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm"
            />
            <button
              onClick={handleAddSlot}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-1.5 rounded-lg"
            >
              Add Slot
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {daySlots.map((slot) =>
              editingSlotId === slot.id ? (
                <li
                  key={slot.id}
                  className="flex flex-wrap items-center gap-2 bg-primary-50 rounded-lg px-3 py-2 text-sm"
                >
                  <input
                    type="time"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="border rounded-lg px-2 py-1 text-xs"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="border rounded-lg px-2 py-1 text-xs"
                  />
                  <button
                    onClick={() => {
                      updateSlot(slot.id, { startTime: editStart, endTime: editEnd });
                      setEditingSlotId(null);
                    }}
                    className="bg-primary-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSlotId(null)}
                    className="text-slate-500 text-xs px-2 py-1"
                  >
                    Cancel
                  </button>
                </li>
              ) : (
                <li
                  key={slot.id}
                  className="flex flex-wrap items-center justify-between gap-2 bg-surface-muted rounded-lg px-3 py-2 text-sm"
                >
                  <span>
                    {slot.startTime} – {slot.endTime}
                    {slot.booked && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide bg-accent-500 text-white px-2 py-0.5 rounded-full">
                        Booked
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-2 items-center">
                    {!slot.booked && (
                      <>
                        <input
                          placeholder="Your name"
                          value={requesterName}
                          onChange={(e) => setRequesterName(e.target.value)}
                          className="border rounded px-2 py-1 text-xs w-24"
                        />
                        <input
                          placeholder="Topic"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="border rounded px-2 py-1 text-xs w-28"
                        />
                        <button
                          onClick={() => handleRequest(slot)}
                          className="text-primary-600 text-xs font-medium hover:underline"
                        >
                          Request
                        </button>
                        <button
                          onClick={() => {
                            setEditingSlotId(slot.id);
                            setEditStart(slot.startTime);
                            setEditEnd(slot.endTime);
                          }}
                          className="text-slate-500 text-xs font-medium hover:underline"
                        >
                          Modify
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeSlot(slot.id)}
                      className="text-red-500 text-xs font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            )}
            {daySlots.length === 0 && (
              <li className="text-xs text-slate-400">
                No availability added for this day.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Requests + Confirmed */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="font-heading font-semibold text-primary-700 mb-3">
            Meeting Requests
          </h3>
          <ul className="space-y-2">
            {requests
              .filter((r) => r.status === "pending")
              .map((r) => (
                <li key={r.id} className="bg-surface-muted rounded-lg p-3 text-sm">
                  <p className="font-medium">
                    {r.requesterName} ({r.requesterRole})
                  </p>
                  <p className="text-slate-500 text-xs">
                    {r.date} · {r.startTime}–{r.endTime}
                  </p>
                  <p className="text-xs mt-1">{r.topic}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => respondToRequest(r.id, "accepted")}
                      className="bg-accent-600 text-white text-xs px-2 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequest(r.id, "declined")}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            {requests.filter((r) => r.status === "pending").length === 0 && (
              <li className="text-xs text-slate-400">No pending requests.</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="font-heading font-semibold text-primary-700 mb-3">
            Confirmed Meetings
          </h3>
          <ul className="space-y-2">
            {confirmedMeetings.map((m) => (
              <li key={m.id} className="border-l-4 border-accent-500 pl-3 py-1 text-sm">
                <p className="font-medium">{m.topic}</p>
                <p className="text-xs text-slate-500">
                  {m.date} · {m.startTime}–{m.endTime} with {m.requesterName}
                </p>
              </li>
            ))}
            {confirmedMeetings.length === 0 && (
              <li className="text-xs text-slate-400">No confirmed meetings yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
