# BigDSA — Frontend

Interactive platform to explore data structures and algorithm (DSA) patterns and analyze algorithmic complexity. Built with **Next.js 15**, **React 19**, and **TypeScript**.

---

## Prerequisites

- [Bun](https://bun.sh/) `>= 1.0` (package manager and runtime)
- [Node.js](https://nodejs.org/) `>= 20`
- BigDSA backend running and accessible (see `NEXT_PUBLIC_API_URL` variable)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Riodev28/fe-big-dsa.git frontend
cd frontend
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Copy the example file and adjust the values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
APP_ENV=local
NEXT_PUBLIC_API_URL=http://localhost:8000   # Backend base URL
PORT=3000
```

> `NEXT_PUBLIC_API_URL` is the only critical variable. It must point to the backend instance that exposes `/analyze/temporal` and the other endpoints.

### 4. Start the development server

```bash
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Production build

```bash
bun run build
bun start
```

---

## Available scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `bun dev`        | Development server with Turbopack on port 3000 |
| `bun run build`  | Compiles the app for production                |
| `bun start`      | Starts the production build                    |
| `bun run lint`   | Runs the Next.js linter                        |
| `bun run format` | Formats code with Prettier                     |

---

## Architecture

### Tech stack

| Technology              | Role                             |
| ----------------------- | -------------------------------- |
| Next.js 15 (App Router) | Main framework, routing, and SSR |
| React 19                | UI library                       |
| TypeScript              | Static typing                    |
| Tailwind CSS v4         | Utility styles                   |
| shadcn/ui + Radix UI    | Accessible base components       |
| Monaco Editor           | Embedded code editor             |
| Recharts                | Complexity chart visualization   |
| Axios                   | HTTP client for the backend      |

---

### Directory structure

```
frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, global sidebar)
│   ├── page.tsx                # Home — feature listing
│   ├── globals.css             # CSS variables and global styles
│   └── big-o/
│       └── page.tsx            # Feature: Big O complexity analysis
│
├── components/
│   ├── label.tsx               # Generic Label component
│   └── ui/                     # Reusable UI components
│       ├── ai-summary.tsx      # Displays the AI-generated explanation
│       ├── analyze-button.tsx  # Button that triggers the analysis
│       ├── badge.tsx           # Status/complexity badge
│       ├── button.tsx          # Base button
│       ├── chart.tsx           # Recharts wrapper
│       ├── code-editor.tsx     # Configured Monaco editor
│       ├── code-editor-header.tsx # Editor header (language, actions)
│       ├── complexity-display.tsx # Displays O(n), O(log n), etc.
│       ├── input.tsx           # Base input
│       ├── notation-chart.tsx  # Comparative Big O notation chart
│       ├── separator.tsx       # Visual divider
│       ├── sidebar.tsx         # Global side navigation
│       └── switch.tsx          # Toggle to enable AI analysis
│
├── consts/
│   └── complexity-colors-mapper.ts  # Complexity → visual color mapping
│
├── lib/
│   ├── api.ts                  # Axios client and backend call functions
│   └── utils.ts                # Utilities (cn for classnames, etc.)
│
├── types/
│   ├── dto.ts                  # Backend response interfaces (BigOAiResult, Analysis, AI)
│   └── request.ts              # Request payload interfaces (TemporalAnalysisPayload)
│
├── .env.example                # Environment variable template
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS + Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

### Data flow

```
User writes code in Monaco Editor
        │
        ▼
  analyze-button.tsx  ──►  lib/api.ts  ──►  POST /analyze/temporal
                                                    │
                                                    ▼ BigOAiResult
                              ┌────────────────────────────────────┐
                              │  analysis.time_complexity          │
                              │  analysis.max_loop_depth           │
                              │  analysis.recursive                │
                              │  ai.temporal_explanation (if AI)   │
                              └────────────────────────────────────┘
                                          │
               ┌───────────────┬──────────┘──────────┐
               ▼               ▼                      ▼
   complexity-display.tsx  notation-chart.tsx    ai-summary.tsx
```

### Backend communication

All backend access is centralized in [lib/api.ts](lib/api.ts). The Axios client reads `NEXT_PUBLIC_API_URL` as `baseURL`. Currently exposes:

- `analyzeTemporalComplexity(payload)` → `POST /analyze/temporal`

To add new endpoints, simply add a function in that file following the same pattern with the `post<T>` helper.

---

### Conventions

- **Path alias `@/`** points to the project root (configured in `tsconfig.json`).
- Components in `components/ui/` are general-purpose; feature-specific ones live inside `app/<feature>/`.
- Backend types are defined in `types/dto.ts`; output payloads in `types/request.ts`.
