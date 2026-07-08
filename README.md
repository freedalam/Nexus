# Nexus – Week 1 (Scheduling & Setup)

React + TypeScript + Vite + Tailwind CSS project implementing:
- A consistent UI theme (colors, typography, responsive grid)
- A meeting scheduling calendar (availability slots, meeting requests, accept/decline, confirmed meetings on dashboard)

## Run locally

```bash
npm install
npm run dev
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
