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

## Week 2 additions

```
src/
├── components/
│   ├── call/
│   │   └── VideoCall.tsx        # WebRTC-based call UI: getUserMedia camera/mic
│   │                              preview, mute/camera toggle, screen share via
│   │                              getDisplayMedia, start/end call, live timer
│   └── documents/
│       ├── DocumentChamber.tsx   # Page: upload list + preview + status + signature
│       ├── SignaturePad.tsx      # Reusable canvas-based e-signature capture
│       └── useDocumentChamber.ts # State/logic hook: add/remove docs, set status,
│                                   save/clear signature
│
├── context/
│   └── DocumentContext.tsx       # Shares one useDocumentChamber() instance across
│                                    pages (Dashboard reads document counts from here)
│
└── types/
    └── documents.ts              # DealDocument, DocumentStatus types
```

### Notes on the Video Call implementation

This is a genuine WebRTC-powered UI (real `getUserMedia`/`getDisplayMedia` calls, not
a static mock), but it only renders **your own local camera preview** rather than a
live two-person call. A real peer-to-peer video call additionally requires:
- A **signaling server** (e.g. Socket.io/WebSocket backend) to exchange session
  descriptions (SDP) and ICE candidates between two browsers
- `RTCPeerConnection` wiring on both ends to actually connect the streams

That backend/signaling piece is out of scope for a frontend-only week — the UI here
(start/end call, mute, camera toggle, screen share, call timer) is built and wired
correctly so it's ready to plug a real `RTCPeerConnection` into later.

### Notes on the Document Chamber

- File **preview** uses `URL.createObjectURL()` — works for PDFs (via `<embed>`) and
  images natively in-browser. `.doc`/`.docx` files can be uploaded and tracked, but
  the browser can't render Word documents natively, so those show a fallback message
  instead of a broken preview.
- **E-signature** is a canvas the user draws on with mouse or touch, exported as a
  base64 PNG via `canvas.toDataURL()` — a lightweight mockup, not a legal e-sign
  integration (which would need a real provider like DocuSign/HelloSign in production).
- Saving a signature automatically flips the document's status to **Signed**.

## Why this structure

- **Hook/UI separation** — `useMeetingScheduler` and `useDocumentChamber` have zero JSX;
  they can be unit-tested or reused (e.g. later swapped for real backend calls) without
  touching any UI.
- **Context over prop drilling** — `SchedulerContext` and `DocumentContext` let any page
  (Dashboard, Calendar, Documents) read/write the same state without passing props down
  through every route. Week 3 (payments) will follow the same pattern.
- **Theme tokens centralised** — colors/spacing/radius live in `tailwind.config.js` and
  `theme.css` instead of being hardcoded in components, so later weeks can restyle globally
  in one place.

