# Apex Applied — Project Plan

## What This App Is

A job application tracker built for aggressive job seekers who apply across multiple platforms and follow up manually. The core problem it solves: you apply to 60+ jobs, lose track of where you are, miss follow-up windows, and get ghosted because you forgot to call back.

The killer feature is the **Follow-up Engine** — every job card has urgency states, overdue flags, and a follow-up action checklist. The dashboard always shows what needs your attention today, sorted by urgency automatically.

This is built as a SaaS product — it has a landing page, auth, and is designed for real users, not just personal use.

---

## Stack

| Layer              | Choice                           | Reason                                                                      |
| ------------------ | -------------------------------- | --------------------------------------------------------------------------- |
| Frontend + Backend | Next.js 14 (App Router, JS)      | Full-stack, API routes built in, no separate backend needed                 |
| Database           | MongoDB + Mongoose               | Familiar, good for complex queries, interview-worthy                        |
| Auth               | NextAuth.js (Google OAuth only)  | Simple, production-grade, one-click login                                   |
| Image Storage      | Cloudinary                       | Industry standard for image uploads, free tier sufficient                   |
| Styling            | Tailwind CSS                     | Utility-first, fast, consistent                                             |
| Animations         | Framer Motion (scalpel use only) | Entrance animations, micro-interactions — never on scroll, never continuous |
| Design System      | UX Pro Max Skill                 | Generates MASTER.md before any code is written                              |

---

## UI Direction

**Concept:** Dark Glass-Bento with Neo-Brutalist accents

- **Base:** `#0a0a0a` background, `#111111` card surface
- **Accent:** `#F59E0B` (amber) — one color, used with intent
- **Cards:** Glassmorphism (`backdrop-blur-md`, `bg-white/5`, `border border-white/10`) + hard box-shadow offset (`4px 4px 0px #F59E0B`)
- **Buttons:** Neo-brutalist — solid fill, 3px hard shadow, no border-radius or minimal radius
- **Typography:** Inter — tight tracking, high contrast whites
- **Layout:** CSS Grid Bento on dashboard
- **Animations:**
  - CSS only → hovers, color transitions, border changes, shadow shifts
  - Framer Motion → page entrance (`fadeInUp` once), card add/remove, status badge change, success flash
  - Never animate on scroll, never continuous loops, always under 300ms

**Design system must be generated before writing any code:**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "job tracker saas dashboard dark mode bento glassmorphism" --design-system --persist -p "Apex Applied"
```

This creates `design-system/MASTER.md` — reference it in every AntiGravity prompt.

---

## Pages

### 1. Landing Page `/`

The app needs to look like a real SaaS product. Sections:

- **Hero** — headline, subheadline, "Get Started with Google" CTA button
- **Problem section** — "You apply. You forget. You get ghosted." — 3 pain points
- **Features section** — Follow-up Engine, Job Cards, Auto-Archive, screenshot upload
- **How it works** — 3 steps: Add job → Track follow-ups → Never miss a call back
- **CTA bottom** — one more sign in button

### 2. Auth Page `/auth/signin`

- Google OAuth button only
- Minimal, clean, centered card
- Redirect to dashboard after login

### 3. Dashboard `/dashboard`

- Bento grid of job cards
- **Top bar:** 4 stat numbers — Total Applied / Active / Follow Up Today / Responses
- **Sort order:** Overdue follow-ups first → then by date applied (newest)
- **Filter bar:** All / Active / Following Up / Responded / Archived
- **Add Job button** — top right, prominent, amber
- Empty state if no jobs yet — illustrated, friendly

### 4. Add Job Page `/jobs/new`

Full form page:

- Company name (text)
- Role/Position title (text)
- Platform applied on (select: LinkedIn / Naukri / Indeed / Company Website / Cold Email / Referral / Other)
- Job screenshot upload (Cloudinary — drag and drop or click)
- Job URL (optional)
- Salary range (optional, text)
- Applied date (date picker, defaults to today)
- Follow-up date (date picker, defaults to applied date + 5 days)
- Recruiter contact section:
  - Name
  - Phone number
  - Email
  - WhatsApp (checkbox — same as phone, or different number)
- Notes (textarea — free text dump)
- Tags (multi-select: Remote / Hybrid / On-site / Startup / Product / Service / Night Shift)

### 5. Job Detail Page `/jobs/[id]`

Full page — not a modal. Sections:

- **Header:** Company name, role, platform badge, days since applied, current status badge
- **Screenshot:** Displayed large, like a document. Click to open full size.
- **Job Info:** URL, salary, applied date, tags
- **Recruiter Contact:** Name, phone (tap to call), email (tap to compose), WhatsApp button
- **Follow-up Engine panel:**
  - Follow-up date display
  - Checklist: `[ ] Called` `[ ] WhatsApp sent` `[ ] Email sent`
  - "Mark follow-up done" button — resets checklist, sets new follow-up date +5 days
  - Urgency indicator — Green (on track) / Yellow (due today) / Red (overdue)
- **Activity Timeline:** Timestamped log at bottom
  - Auto-logged: "Applied via LinkedIn — May 3"
  - Auto-logged: "Status moved to Responded — May 8"
  - Manually added: "Called recruiter, no answer — May 6"
  - User can add manual timeline entries
- **Status controls:** Move to → Responded / Rejected / Locked / Archive
- **Edit button** — opens Edit Job page
- **Delete button** — with confirmation

### 6. Edit Job Page `/jobs/[id]/edit`

Same form as Add Job, pre-filled with existing data.

### 7. Archive Page `/archive`

- Dimmed card grid of archived/dead jobs
- Filter: Auto-archived (ghosted) / Rejected / Manually archived
- Each card has "Restore" button
- Permanently delete option

---

## Data Model

### User (managed by NextAuth — stored in MongoDB via adapter)

```
_id
name
email
image
createdAt
```

### Job

```
_id
userId                  // ref to User
companyName             // string, required
roleTitle               // string, required
platform                // enum: linkedin | naukri | indeed | company_website | cold_email | referral | other
jobUrl                  // string, optional
salaryRange             // string, optional
screenshotUrl           // string (Cloudinary URL)
screenshotPublicId      // string (for Cloudinary deletion)
appliedDate             // Date, required
followUpDate            // Date, required (default: appliedDate + 5 days)

status                  // enum: active | responded | rejected | archived
isLocked                // boolean, default false (locked = immune to auto-archive)

recruiter: {
  name                  // string
  phone                 // string
  email                 // string
  whatsapp              // string (same as phone or different)
}

followUpChecklist: {
  called                // boolean, default false
  whatsappSent          // boolean, default false
  emailSent             // boolean, default false
}

tags                    // array of strings: remote | hybrid | onsite | startup | product | service | nightshift

notes                   // string (free text)

timeline: [             // array of objects
  {
    event               // string
    type                // enum: auto | manual
    createdAt           // Date
  }
]

createdAt               // Date
updatedAt               // Date
```

---

## Auto-Archive Logic

This runs via an API route that gets called on dashboard load (no cron needed for v1):

- `status === active` AND `daysSinceApplied >= 30` AND `isLocked === false` → auto-set status to `archived`, add timeline entry "Auto-archived — no response in 30 days"
- `status === active` AND `daysSinceApplied >= 20` AND `isLocked === false` → card enters "Going cold" visual state (dimmed, warning badge) — not archived yet
- `status === rejected` AND `daysSinceRejected >= 7` AND `isLocked === false` → auto-set status to `archived`
- `isLocked === true` → immune to all of the above

---

## Follow-up Engine Logic

- `followUpDate < today` AND `status === active` → **Overdue** state (red border, screaming badge)
- `followUpDate === today` AND `status === active` → **Due Today** state (amber border)
- `followUpDate > today` AND `status === active` → **On Track** state (green dot)
- Dashboard default sort: Overdue first → Due Today → On Track → by appliedDate desc
- When user clicks "Mark follow-up done":
  - All checklist items reset to false
  - `followUpDate` = today + 5 days
  - Timeline entry added: "Follow-up completed — [date]"

---

## API Routes

```
POST   /api/auth/[...nextauth]     // NextAuth handler

GET    /api/jobs                   // Get all jobs for current user
POST   /api/jobs                   // Create new job
GET    /api/jobs/[id]              // Get single job
PUT    /api/jobs/[id]              // Update job
DELETE /api/jobs/[id]              // Delete job

PATCH  /api/jobs/[id]/status       // Change status only
PATCH  /api/jobs/[id]/followup     // Mark follow-up done
PATCH  /api/jobs/[id]/checklist    // Update checklist items
POST   /api/jobs/[id]/timeline     // Add manual timeline entry
PATCH  /api/jobs/[id]/lock         // Toggle lock

POST   /api/upload                 // Cloudinary upload handler
GET    /api/jobs/check-archive     // Auto-archive check (called on dashboard load)
```

---

## Folder Structure

```
apex-applied/
├── app/
│   ├── (auth)/
│   │   └── signin/
│   │       └── page.js
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── jobs/
│   │   │   ├── new/
│   │   │   │   └── page.js
│   │   │   └── [id]/
│   │   │       ├── page.js
│   │   │       └── edit/
│   │   │           └── page.js
│   │   └── archive/
│   │       └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.js
│   │   ├── jobs/
│   │   │   ├── route.js
│   │   │   ├── check-archive/
│   │   │   │   └── route.js
│   │   │   └── [id]/
│   │   │       ├── route.js
│   │   │       ├── status/
│   │   │       │   └── route.js
│   │   │       ├── followup/
│   │   │       │   └── route.js
│   │   │       ├── checklist/
│   │   │       │   └── route.js
│   │   │       ├── timeline/
│   │   │       │   └── route.js
│   │   │       └── lock/
│   │   │           └── route.js
│   │   └── upload/
│   │       └── route.js
│   ├── layout.js
│   ├── page.js                    // Landing page
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.js
│   │   ├── Badge.js
│   │   ├── Card.js
│   │   └── Input.js
│   ├── jobs/
│   │   ├── JobCard.js             // Dashboard card
│   │   ├── JobForm.js             // Add/Edit form
│   │   ├── JobTimeline.js         // Activity log
│   │   ├── FollowUpPanel.js       // Follow-up engine panel
│   │   └── RecruiterContact.js    // Contact section
│   ├── dashboard/
│   │   ├── StatsBar.js            // 4 stat numbers
│   │   ├── FilterBar.js           // Status filter tabs
│   │   └── BentoGrid.js           // Grid layout wrapper
│   └── layout/
│       ├── Navbar.js
│       └── Sidebar.js             // Optional for dashboard
├── lib/
│   ├── mongodb.js                 // DB connection
│   ├── cloudinary.js              // Cloudinary config
│   ├── auth.js                    // NextAuth config
│   └── utils.js                   // Date helpers, urgency calculator
├── models/
│   └── Job.js                     // Mongoose schema
├── hooks/
│   ├── useJobs.js
│   └── useFollowUp.js
├── design-system/
│   └── MASTER.md                  // Generated by UX Pro Max — do not edit manually
├── .env.local
├── plan.md
├── AGENTS.md
└── package.json
```

---

## Environment Variables

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Build Order

Build in this exact sequence. Do not skip ahead.

1. Project setup — Next.js init, install dependencies, env vars
2. Generate `design-system/MASTER.md` with UX Pro Max skill
3. MongoDB connection (`lib/mongodb.js`) + Job model (`models/Job.js`)
4. NextAuth setup — Google OAuth, MongoDB adapter
5. Base UI components — Button, Badge, Card, Input (reference MASTER.md)
6. Landing page
7. Auth page
8. Dashboard page — StatsBar, FilterBar, BentoGrid, JobCard
9. Add Job page — JobForm + Cloudinary upload
10. Job Detail page — full page with all panels
11. Edit Job page
12. Follow-up Engine logic — checklist, urgency states, mark done
13. Auto-archive logic — check-archive API route
14. Timeline — auto-logging on status changes
15. Archive page
16. Polish — Framer Motion entrance animations, empty states, loading states

---

## Framer Motion Rules (Strict)

**Allowed:**

- Page entrance: `fadeInUp` once on mount, `duration: 0.3`
- Card entering grid: staggered `fadeIn`, `duration: 0.2`
- Card removal: `fadeOut` + `scale: 0.95`, `duration: 0.2`
- Status badge change: quick `scale` pulse
- Success states: brief `scale` bounce on "Mark done"

**Never:**

- Animate on scroll
- Continuous loops or pulsing animations
- `layout` prop on large containers
- More than 3 simultaneous animations
- Any animation over 400ms

---

## V2 Ideas (Do Not Build Now)

- Recruiter side — company can claim profile
- Email integration — detect replies automatically
- Stats page — response rate %, stage drop-off chart
- Mobile app
- Shareable pipeline link
- Pro plan / monetization
