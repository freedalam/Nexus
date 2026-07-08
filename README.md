# Nexus – Week 1 (Scheduling & Setup)

React + TypeScript + Vite + Tailwind CSS project implementing:
- A consistent UI theme (colors, typography, responsive grid)
- A meeting scheduling calendar (availability slots, meeting requests, accept/decline, confirmed meetings on dashboard)

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
  context/
    SchedulerContext.tsx
  pages/
    Dashboard.tsx
  theme/
    theme.css
  types/
    calendar.ts
  App.tsx
  main.tsx
  index.css
```

See `ARCHITECTURE.md` for a full breakdown of the component structure and data flow (required for Milestone 1).
