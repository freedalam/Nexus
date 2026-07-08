import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import MeetingCalendar from "./components/calendar/MeetingCalendar";
import { SchedulerProvider } from "./context/SchedulerContext";

export default function App() {
  return (
    <SchedulerProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<MeetingCalendar />} />
        </Routes>
      </BrowserRouter>
    </SchedulerProvider>
  );
}
