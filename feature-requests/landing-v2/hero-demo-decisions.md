# Hero Visual & Demo Section — Decision Log
> Date: 2026-03-28

## Two options considered

### Option A — Real/pre-recorded feed in Hero
Right column of hero shows event cards appearing automatically.

### Option B — Interactive demo at bottom (old landing approach)
After reading everything, user gets iframe + buttons.

## Decision: BOTH — for different purposes

### Hero right column: Pre-recorded feed (NOT real WebSocket)

**Why pre-recorded, not real WebSocket:**

| Concern | Real WebSocket | Pre-recorded JSON |
|---|---|---|
| Backend dependency | If server down = empty hero | Always works |
| Load time | Connection handshake delay | Instant |
| Appearance | "Real" | Identical visually |
| Complexity | CORS, auth, reconnect | Simple setTimeout loop |
| SSG/SSR | Client-only required | Works everywhere |

Implementation: Vue component with `setInterval`, array of ~20 pre-recorded events,
realistic delays (2.5–3.5s), same PreviewCard shell as real app.

Event sequence includes: Sentry exception, SMTP email, XHProf profiler, Monolog error, Sentry QueryException, etc.

### Demo section (before Community): Button-triggered live feed (NOT iframe)

**Why NOT iframe:**

| Concern | iframe | Custom component |
|---|---|---|
| Mobile | Unusable | Full control |
| Styling | Can't control | Matches landing |
| Performance | Full page load | Lightweight |
| CORS | Potential issues | Same-origin API |
| Backend down | White rectangle | Graceful fallback |

Implementation:
- Left panel: PreviewCard-based feed, listens on WebSocket for new events
- Right panel: grouped buttons (Sentry / Monolog / SMTP / Profiler / VarDumper)
- Click → POST to `$config.public.examples_url/api/{action}` → event appears
- Pre-seeded with 3-4 events so panel is never empty on load
- Fallback if backend down: "Demo temporarily unavailable. Run locally:" + docker run

## Placement in page

```
Hero (pre-recorded feed, passive)
  ↓ user reads
  ↓ understands the product
  ↓ sees how to install
Interactive Demo (button-triggered, active)
  ↓ "aha moment" - they clicked, they saw it
Install section
Community
```

## Key insight from experts

**Artem:** The old demo with buttons was the "aha moment" that convinced him personally.
**Dana:** Effect of ownership — user feels they're "already using" the product.
**Priya:** Passive feed in hero creates ambient trust. Active demo after reading = conversion moment.
**Marcus:** Both use same PreviewCard components. Different data source only.
