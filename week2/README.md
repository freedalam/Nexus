# Nexus – Weeks 1 & 2

React + TypeScript + Vite + Tailwind CSS project implementing:

**Week 1**
- A consistent UI theme (colors, typography, responsive grid)
- A meeting scheduling calendar (availability slots, meeting requests, accept/decline, confirmed meetings on dashboard)


**Week 2**
- A video call UI (real WebRTC camera/mic preview, mute/camera toggle, screen share, start/end call)
- A Document Chamber (upload & preview PDFs/images, canvas-based e-signature, Draft/In Review/Signed status)

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    NavBar.tsx
    calendar/
      MeetingCalendar.tsx
      useMeetingScheduler.ts
    call/
      VideoCall.tsx
    documents/
      DocumentChamber.tsx
      SignaturePad.tsx
      useDocumentChamber.ts
  context/
    SchedulerContext.tsx
    DocumentContext.tsx
  pages/
    Dashboard.tsx
  theme/
    theme.css
  types/
    calendar.ts
    documents.ts
  App.tsx
  main.tsx
  index.css
```

See `ARCHITECTURE.md` for a full breakdown of the component structure and data flow.
