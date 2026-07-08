import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import MeetingCalendar from "./components/calendar/MeetingCalendar";
import VideoCall from "./components/call/VideoCall";
import DocumentChamber from "./components/documents/DocumentChamber";
import { SchedulerProvider } from "./context/SchedulerContext";
import { DocumentProvider } from "./context/DocumentContext";

export default function App() {
  return (
    <SchedulerProvider>
      <DocumentProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<MeetingCalendar />} />
            <Route path="/call" element={<VideoCall />} />
            <Route path="/documents" element={<DocumentChamber />} />
          </Routes>
        </BrowserRouter>
      </DocumentProvider>
    </SchedulerProvider>
  );
}
