# TaskFlow

A task board with a live kanban, a calendar-and-timer side panel, and analytics — built with the Next.js App Router, Tailwind CSS 4, daisyUI, and GSAP.

![Next.js](https://img.shields.io/badge/Next.js-16.4.2-000?logo=next.js) ![React](https://img.shields.io/badge/React-19.3-087ea4?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss) ![daisyUI](https://img.shields.io/badge/daisyUI-5.7-5a4fc4) ![GSAP](https://img.shields.io/badge/GSAP-3.15-0ae4f5?logo=greensock)

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Architecture notes](#architecture-notes)
- [Data model](#data-model)
- [Theming](#theming)
- [Known gaps](#known-gaps)

---

## Features

**Workspace (the home page)**

- **Kanban board** with native drag-and-drop between *To do*, *In progress*, and *Completed*. Counts and progress recalculate the moment a card moves.
- **Foldable left sidebar** — collapses from 288px to an 80px icon rail with tooltips, a per-status task dot, and a radial progress ring. The folded state is remembered in `localStorage` and synced across tabs.
- **Right aside panel** — a mini calendar with deadline markers, a focus timer, and an upcoming-tasks list. Picking a day in the calendar filters the task list to that day; clicking a task sets it as the timer's focus.
- **Welcome banner** with a time-of-day greeting, the signed-in user's name, and count-up stat tiles.
- **Filter bar** for free-text search, priority, project, tag, and assignee.
- **Slide-over panels on small screens** — below `lg` the sidebar becomes a dismissible drawer, and below `xl` the right panel slides in over the board (Escape closes it).

**Pages**

- `/features` — product feature grid with scroll reveals.
- `/how-it-works` — the four-step workflow, the daily loop, and the "why it works" pillars.
- `/analytics` — status, priority, and project breakdowns rendered as bar and donut charts.
- `/profile` — account details and sign-out.

**Platform**

- **Authentication** with [better-auth](https://better-auth.com) — email/password and Google, stored in MongoDB.
- **Dark purple theme by default** with a light counterpart, both custom daisyUI themes.
- **GSAP motion** — staggered entrances, scroll-triggered reveals, and a pulsing timer ring, all respecting `prefers-reduced-motion`.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4.2 (App Router, Turbopack) |
| UI runtime | React 19.3 |
| Language | TypeScript 5 (`strict`) |
| Styling | Tailwind CSS 4 + daisyUI 5.7.50 (custom themes) |
| Animation | GSAP 3.15 + `@gsap/react` 2.1 (ScrollTrigger) |
| Auth | better-auth 1.7.10 |
| Database | MongoDB 7.7 (`@better-auth/mongo-adapter`) |
| Icons | Hand-rolled inline SVGs — no icon dependency |

---

## Getting started

**Requirements:** Node.js 20.9+ and a MongoDB Atlas cluster (or a local `mongod`).

```bash
# 1. Install dependencies
npm install

# 2. Create the environment file
cp .env.example .env.local   # then fill in the values below

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note** — `src/lib/auth.ts` builds a MongoDB client when the module is imported. The connection itself is lazy, so the app still boots without a database, but every auth route (sign-in, sign-up, session) needs a reachable MongoDB instance.

---

## Environment variables

Create `.env.local` in the project root:

```bash
# better-auth — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secret"
# Public URL of the app, used for OAuth callbacks and session cookies
BETTER_AUTH_URL="http://localhost:3000"

# MongoDB connection string
MONGODB_URL="mongodb+srv://user:password@cluster.mongodb.net"

# Google OAuth (optional — only needed for the "Continue with Google" buttons)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

For Google sign-in, add this authorized redirect URI in the Google Cloud console:

```
https://<your-domain>/api/auth/callback/google
```

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with Turbopack on [localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint over the project |

Type-check separately with `npx tsc --noEmit`.

---

## Project structure

```
src/
├── app/
│   ├── (auth)/            signin, signup
│   ├── (marketing)/       home, features, how-it-works, analytics, profile
│   ├── api/auth/[...all]/ better-auth route handler
│   ├── globals.css        Tailwind + the two daisyUI themes
│   └── layout.tsx         root layout, fonts, theme bootstrap script
├── components/            UI (kanban, sidebar, aside, charts, banner, …)
│   └── animations/        the shared scroll-reveal wrapper
├── hooks/
│   ├── use-media-query.ts
│   └── use-todos.ts       the single entry point for reading and writing tasks
└── lib/
    ├── todos.ts           the domain model — the only file that knows a task's shape
    ├── todo-repository.ts storage boundary (currently an in-memory array)
    ├── todo-seed.ts       the sample dataset
    ├── auth.ts            better-auth server config
    ├── auth-client.ts     better-auth client
    ├── theme.ts           theme tokens, storage key, pre-paint init script
    ├── sidebar.ts         external store for the folded sidebar
    ├── gsap.ts            GSAP plugin registration and shared easings
    ├── dates.ts           local-time date helpers
    └── clock.ts           a stable "today" snapshot
```

The `@/*` alias points at `src/*`.

---

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | public | The workspace: board, sidebar, welcome banner, right panel |
| `/features` | public | Feature grid |
| `/how-it-works` | public | The workflow, step by step |
| `/analytics` | public | Charts and breakdowns |
| `/profile` | signed in | Account details and sign-out |
| `/signin` | public | Email/password and Google sign-in |
| `/signup` | public | Account creation |
| `/api/auth/*` | public | better-auth handler |

---

## Architecture notes

**One file owns the task shape.** `src/lib/todos.ts` is the only place that knows what a `Todo` looks like. Swapping the in-memory store for MongoDB means changing `todo-repository.ts` and nothing in the UI.

**The repository is the storage boundary.** `src/lib/todo-repository.ts` exposes `list`, `find`, `create`, `update`, `move`, `remove`, `replaceAll`, and `all`. The file carries an example Mongo implementation in its header comment. Today it holds an in-memory array seeded from `SAMPLE_TODOS`.

**`useTodos` is the only door to the data.** Every component reads and writes tasks through this hook, so the day the repository becomes async only the hook changes — the direct calls become awaited ones and the return shape stays the same.

**Hydration is treated as a first-class concern.**

- `useToday()` returns `null` during the server render and the first client paint. Components must treat `null` as "not ready" and render a skeleton, or the markup will not match.
- State is seeded from an immutable snapshot. The shared repository is only read after mount, so earlier mutations cannot leak into the hydration pass.
- Browser-only state (the theme, the folded sidebar) is read through `useSyncExternalStore` with a stable server snapshot, never during render.

**Motion is opt-out by default.** Every GSAP timeline is wrapped in `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`, so a visitor who asked for reduced motion simply sees the content appear.

---

## Data model

```ts
type Todo = {
    id: string;
    userId: string;              // owner; "" means unassigned
    title: string;
    description?: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    project: string;             // grouping label, e.g. "Backend"
    due: string;                 // human label, e.g. "Today"
    dueDate: string | null;      // "YYYY-MM-DD" in local time
    tags: string[];
    createdAt: string;           // ISO timestamp
    updatedAt: string;           // ISO timestamp
};
```

Deadlines are stored as a `YYYY-MM-DD` string rather than a `Date` so local time is preserved — `new Date("2026-10-22")` would otherwise parse as UTC and shift the day.

---

## Theming

`src/app/globals.css` disables the stock daisyUI themes (`themes: false`) and defines two hand-tuned ones, both built around purple:

- **`dark`** (default, `prefersdark`) — deep aubergine surfaces with a vivid violet accent.
- **`light`** — the same palette inverted for bright environments.

Because the themes are daisyUI themes, every `base-*`, `primary`, `secondary`, and `accent` token in the app follows the palette automatically. The choice is stored in `localStorage` and applied before first paint by an inline script in `src/app/layout.tsx`, so there is no flash of the wrong theme on load.

---

## Known gaps

- The navbar links to `/testimonials` and `/faq`, but neither page exists yet.
- The task board is not yet persisted — `todo-repository.ts` is still in-memory, so tasks reset on a full reload.
- `src/lib/auth.ts` opens the MongoDB client eagerly at import time rather than lazily on first request.
