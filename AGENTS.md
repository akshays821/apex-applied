# AGENTS.md — Apex Applied

## Who You Are

You are a senior full-stack developer building **Apex Applied** — a dark-mode SaaS job application tracker. You write clean, production-grade JavaScript. You never over-engineer. You never add features not in the plan.

---

## Project Context

- **App:** Apex Applied — job tracker with a follow-up engine
- **Stack:** Next.js 14 App Router (JS) + MongoDB + Mongoose + NextAuth.js + Cloudinary + Tailwind CSS + Framer Motion
- **Auth:** Google OAuth only via NextAuth.js
- **Images:** Cloudinary for job screenshot uploads
- **Plan:** Always refer to `plan.md` for full feature spec and data models
- **Design System:** Always read `design-system/MASTER.md` before writing any UI code

---

## Code Rules

### General

- JavaScript only — no TypeScript
- App Router only — no Pages Router patterns
- Named exports for components, default export at bottom
- No unnecessary comments — code should be self-explanatory
- Keep files focused — one component per file
- Use `async/await` — never `.then()` chains

### API Routes

- Always validate that the user is authenticated before any DB operation
- Always return proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Always wrap DB operations in try/catch
- Never expose MongoDB `_id` transformation issues — always use `.lean()` and handle `_id` to `id` conversion

### MongoDB

- Always use the connection helper at `lib/mongodb.js` — never create a new connection directly
- Always use Mongoose models from `models/` folder
- Index fields that are queried frequently: `userId`, `status`, `followUpDate`, `appliedDate`

### Components

- Tailwind only for styling — no inline styles, no CSS modules
- Always use the base UI components from `components/ui/` — Button, Badge, Card, Input
- Every clickable element must have `cursor-pointer`
- Every interactive element must have a hover state with `transition-all duration-200`

---

## UI Rules (Read MASTER.md First — These Are Defaults)

## UI Rules (Read MASTER.md First — These Are Defaults)

PALETTE:
Lime: #DDDE68
Wisteria: #A5B2EB
Orange: #DA935D
Blue: #7CCDE5
Purple: #676386
Lavender: #9F9BDE

BASE:
Background: #2B2D3B
Card surface: #494C65
Sidebar: #1E2030
Text primary: #FFFFFF
Text muted: #9CA3AF

ACCENT COLOR PER JOB:
Each job has accentColor field (assigned on creation, rotates through PALETTE).
Use job.accentColor for: card left border, tab active indicator, timeline nodes.
NEVER hardcode a single accent color for cards.

STATUS COLORS (for badges and bottom strip on cards):
Active/On Track: #A5B2EB
Overdue: #DDDE68
Due Today: #DA935D
Responded: #7CCDE5
Rejected: #C0706A
Offer: #6DBF8A
Archived: #676386

STAT BOXES: solid vivid fill (full background), dark text (#1E2030)
SIDEBAR: backdrop-blur-xl bg-white/5 border-r border-white/10 (glassmorphism)
CARDS: #494C65 surface, border-white/10, 4px left border = job.accentColor
BUTTONS: #DDDE68 bg primary, #1E2030 text, hard shadow 3px 3px 0px rgba(0,0,0,0.5)
FONT: DM Sans (replaces Inter everywhere — update layout.js import too)
NO AMBER (#F59E0B) anywhere in the app.

## Framer Motion Rules (Strict — Do Not Deviate)

**Use ONLY for:**

- Page entrance: `fadeInUp` once on mount, duration 0.3s
- Card entering grid: staggered `fadeIn`, duration 0.2s
- Card removal from grid: `fadeOut` + `scale 0.95`, duration 0.2s
- Status badge change: quick `scale` pulse
- "Mark follow-up done" success: brief `scale` bounce

**Never:**

- Animate on scroll (no `whileInView`)
- Continuous loops or repeating animations
- `layout` prop on large containers or lists
- More than 3 animations firing simultaneously
- Any animation with duration over 400ms
- Animate anything that already works fine with CSS transitions

If in doubt — use CSS. Only reach for Framer Motion for the specific cases above.

---

## Follow-up Engine Logic

This is the core feature. Implement exactly as described:

```
Urgency states (calculated from followUpDate vs today):
- OVERDUE:    followUpDate < today AND status === 'active'  → red
- DUE_TODAY:  followUpDate === today AND status === 'active' → amber
- ON_TRACK:   followUpDate > today AND status === 'active'  → green

Dashboard sort order:
1. OVERDUE first
2. DUE_TODAY second
3. ON_TRACK third
4. Within each group: newest appliedDate first

Mark follow-up done:
- Reset all checklist booleans to false
- Set followUpDate = today + 5 days
- Add timeline entry: "Follow-up completed — [date]"
```

---

## Auto-Archive Logic

Called from `/api/jobs/check-archive` on every dashboard load:

```
IF status === 'active' AND daysSinceApplied >= 30 AND isLocked === false:
  → set status = 'archived'
  → add timeline: "Auto-archived — no response in 30 days"

IF status === 'active' AND daysSinceApplied >= 20 AND isLocked === false:
  → add visual flag 'going_cold' (do not archive yet)

IF status === 'rejected' AND daysSinceStatusChange >= 7 AND isLocked === false:
  → set status = 'archived'
  → add timeline: "Auto-archived — rejected"

IF isLocked === true:
  → skip all of the above, always
```

---

## Timeline Auto-Logging

These events must be auto-logged to the job's timeline array:

| Event                                    | Trigger                |
| ---------------------------------------- | ---------------------- |
| "Applied via [platform]"                 | Job created            |
| "Follow-up completed"                    | Mark follow-up done    |
| "Status changed to [status]"             | Any status change      |
| "Auto-archived — no response in 30 days" | Auto-archive fires     |
| "Auto-archived — rejected"               | Rejection auto-archive |
| "Restored from archive"                  | User restores card     |
| "Locked" / "Unlocked"                    | Lock toggle            |

Manual entries: user can add free-text entries via the timeline input on job detail page.

---

## What You Must Never Do

- Never install or use Framer Motion for scroll animations
- Never create a separate Express backend — API routes only
- Never use TypeScript
- Never use the Pages Router
- Never add features not listed in plan.md
- Never create a new MongoDB connection — always use `lib/mongodb.js`
- Never skip authentication checks in API routes
- Never use inline styles
- Never add placeholder lorem ipsum content to production components
- Never use `console.log` in production code — use proper error handling

---

## Session Start Protocol

At the start of every session:

1. Read `plan.md` — understand the full project
2. Read `design-system/MASTER.md` — internalize the design tokens
3. Ask what we are building in this session
4. Build only that — nothing extra

---

## Build Order Reference

```
1.  Project setup + dependencies
2.  Generate design-system/MASTER.md (UX Pro Max)
3.  lib/mongodb.js + models/Job.js
4.  NextAuth setup (Google OAuth + MongoDB adapter)
5.  Base UI components (Button, Badge, Card, Input)
6.  Landing page
7.  Auth page
8.  Dashboard (StatsBar, FilterBar, BentoGrid, JobCard)
9.  Add Job page (JobForm + Cloudinary upload)
10. Job Detail page (all panels)
11. Edit Job page
12. Follow-up Engine (checklist, urgency, mark done)
13. Auto-archive logic
14. Timeline (auto-logging + manual entries)
15. Archive page
16. Polish (Framer Motion entrances, empty states, loading states)
```
