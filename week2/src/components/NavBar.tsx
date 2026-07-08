import { NavLink } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Video, FileText } from "lucide-react";

const linkBase =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";

export default function NavBar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container-responsive flex items-center justify-between h-16 flex-wrap gap-2">
        <span className="font-heading text-lg font-bold text-primary-700">
          Nexus
        </span>
        <div className="flex flex-wrap gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-500 hover:bg-surface-muted"
              }`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-500 hover:bg-surface-muted"
              }`
            }
          >
            <CalendarDays size={16} />
            Calendar
          </NavLink>
          <NavLink
            to="/call"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-500 hover:bg-surface-muted"
              }`
            }
          >
            <Video size={16} />
            Video Call
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-500 hover:bg-surface-muted"
              }`
            }
          >
            <FileText size={16} />
            Documents
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
