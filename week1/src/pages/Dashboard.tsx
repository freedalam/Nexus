import { Link } from "react-router-dom";
import { useScheduler } from "../context/SchedulerContext";

export default function Dashboard() {
  const { confirmedMeetings } = useScheduler();

  return (
    <div className="container-responsive py-8">
      <h1 className="font-heading text-2xl font-bold text-primary-900 mb-1">
        Welcome back 👋
      </h1>
      <p className="text-slate-500 mb-6">
        Here's an overview of your Nexus workspace.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Upcoming Meetings
          </p>
          <p className="text-3xl font-bold text-primary-700 mt-2">
            {confirmedMeetings.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {confirmedMeetings.length === 0
              ? "Go to the Calendar tab to schedule one."
              : "Confirmed and ready."}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Active Deals
          </p>
          <p className="text-3xl font-bold text-accent-600 mt-2">0</p>
          <p className="text-xs text-slate-400 mt-1">Coming in Week 2</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Wallet Balance
          </p>
          <p className="text-3xl font-bold text-slate-700 mt-2">$0.00</p>
          <p className="text-xs text-slate-400 mt-1">Coming in Week 3</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-primary-700">
            Confirmed Meetings
          </h2>
          <Link
            to="/calendar"
            className="text-xs font-medium text-primary-600 hover:underline"
          >
            Open Calendar →
          </Link>
        </div>
        <ul className="space-y-2">
          {confirmedMeetings.map((m) => (
            <li
              key={m.id}
              className="border-l-4 border-accent-500 pl-3 py-1 text-sm"
            >
              <p className="font-medium">{m.topic}</p>
              <p className="text-xs text-slate-500">
                {m.date} · {m.startTime}–{m.endTime} with {m.requesterName}
              </p>
            </li>
          ))}
          {confirmedMeetings.length === 0 && (
            <li className="text-xs text-slate-400">
              No confirmed meetings yet — schedule one from the Calendar tab.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
