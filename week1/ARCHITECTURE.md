# Architecture & Component Structure — Week 1

## Tech stack
- **React 18** + **TypeScript** — component logic and type safety
- **Vite** — dev server and build tool
- **Tailwind CSS** — utility-first styling, themed via `tailwind.config.js`
- **react-router-dom** — client-side routing between Dashboard and Calendar pages
- **react-calendar** — the calendar picker UI
- **date-fns** — date formatting/parsing
- **lucide-react** — icon set used in the nav bar

## Folder structure

```
src/
├── main.tsx                  # App entry point, mounts <App /> and imports global CSS
├── App.tsx                   # Root component: sets up routing + wraps app in SchedulerProvider
├── index.css                 # Tailwind directives
│
├── theme/
│   └── theme.css              # CSS variables (colors, radius, shadow) + responsive
│                               # grid/container utility classes + react-calendar overrides
│
├── context/
│   └── SchedulerContext.tsx   # React Context that shares one instance of the scheduler
│                               # state (slots, requests, confirmed meetings) across every
│                               # page, so Dashboard and Calendar always agree
│
├── types/
│   └── calendar.ts            # Shared TypeScript interfaces: AvailabilitySlot, MeetingRequest
│
├── components/
│   ├── NavBar.tsx             # Top navigation, links to Dashboard and Calendar
│   └── calendar/
│       ├── useMeetingScheduler.ts   # Pure state/logic hook: add/modify/remove slots,
│       │                             # create requests, accept/decline, derive confirmed list
│       └── MeetingCalendar.tsx      # UI: calendar picker, availability list, request list,
│                                     # confirmed meetings list
│
└── pages/
    └── Dashboard.tsx          # Landing page: summary cards + confirmed meetings, pulled
                                # live from SchedulerContext
```

## Data flow

1. `useMeetingScheduler` (a plain hook) owns all scheduling state: `slots`, `requests`, and
   the derived `confirmedMeetings`.
2. `SchedulerProvider` (in `context/SchedulerContext.tsx`) calls that hook **once** at the
   top of the app and exposes it through React Context.
3. Both `MeetingCalendar.tsx` and `Dashboard.tsx` call `useScheduler()` to read/write the
   *same* state — so accepting a meeting in the Calendar page instantly shows it on the
   Dashboard, with no prop drilling and no duplicated state.
4. Routing (`App.tsx`) decides which page renders inside that shared provider.

## Component responsibilities

| Component | Responsibility |
|---|---|
| `App.tsx` | Routing shell, wraps everything in `SchedulerProvider` |
| `NavBar.tsx` | Navigation between pages, highlights active route |
| `Dashboard.tsx` | Overview cards (meetings/deals/wallet) + confirmed meetings list |
| `MeetingCalendar.tsx` | Date picking, add/modify/remove availability, send/accept/decline requests |
| `useMeetingScheduler.ts` | All business logic for the scheduler, no UI |
| `SchedulerContext.tsx` | Wires the hook into React Context for cross-page sharing |

## Why this structure

- **Hook/UI separation** — `useMeetingScheduler` has zero JSX; it can be unit-tested or
  reused (e.g. later swapped for a real backend call) without touching the calendar UI.
- **Context over prop drilling** — since Week 2/3 will add more pages (video call, documents,
  payments) that may also need to reference meetings, Context avoids passing scheduler
  props down through every route.
- **Theme tokens centralised** — colors/spacing/radius live in `tailwind.config.js` and
  `theme.css` instead of being hardcoded in components, so later weeks can restyle globally
  in one place.
