# Architecture Overview

## System Architecture

Strat follows a **client-server architecture** built on the Next.js App Router, with Firebase providing authentication and data persistence, and Google Gemini powering the AI tutoring engine.

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                  │
│   ┌──────────┐  ┌───────────────┐  ┌──────────────────────────┐ │
│   │  Login   │  │  LandingPage  │  │   Authenticated App      │ │
│   │  Page    │  │  (Public)     │  │  ┌────────┐ ┌──────────┐ │ │
│   │          │  │               │  │  │Sidebar │ │ChatCont. │ │ │
│   └──────────┘  └───────────────┘  │  └────────┘ └──────────┘ │ │
│                                     └──────────────────────────┘ │
│         │               │                      │                 │
│         ▼               ▼                      ▼                 │
│   Firebase Auth    useAuth() Hook         fetch("/api/chat")     │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SERVER (Next.js App Router)                   │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  POST /api/chat                                          │  │
│   │  ├── Validates request body (messages[], userId)         │  │
│   │  ├── Calls aiService.getStratResponseStream()            │  │
│   │  ├── Streams Gemini response via ReadableStream          │  │
│   │  └── Post-stream: runs handleMasteryDetection()          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│              ┌───────────┴───────────┐                          │
│              ▼                       ▼                          │
│   ┌──────────────────┐   ┌──────────────────┐                  │
│   │  Google Gemini   │   │ Firebase Firestore│                  │
│   │  (AI Generation) │   │ (Mastery Storage) │                  │
│   └──────────────────┘   └──────────────────┘                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
H2S_submission/
├── README.md                          # Project overview & submission docs
├── codebase/
│   ├── app-code/                      # Main application source
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── layout.tsx             # Root layout (fonts, metadata)
│   │   │   ├── page.tsx               # Home — landing or chat based on auth
│   │   │   ├── globals.css            # Tailwind v4 + design tokens
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Auth page (email/password + Google)
│   │   │   └── api/
│   │   │       └── chat/
│   │   │           └── route.ts       # Streaming chat API endpoint
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── Button.tsx         # Design-system button primitive
│   │   │   ├── chat/
│   │   │   │   └── ChatContainer.tsx  # Chat UI with streaming messages
│   │   │   ├── features/
│   │   │   │   └── LandingPage.tsx    # Public marketing/landing page
│   │   │   └── layout/
│   │   │       └── Sidebar.tsx        # Navigation sidebar + mastery tracker
│   │   ├── constants/
│   │   │   └── prompts.ts             # AI system prompt definition
│   │   ├── hooks/
│   │   │   └── useAuth.ts             # Firebase auth state hook
│   │   ├── lib/
│   │   │   ├── firebase.ts            # Firebase SDK initialization
│   │   │   └── gemini.ts              # Google Gemini SDK initialization
│   │   ├── services/
│   │   │   └── aiService.ts           # AI business logic + mastery detection
│   │   ├── types/
│   │   │   └── chat.ts                # TypeScript interfaces
│   │   ├── Dockerfile                 # Production Docker build
│   │   ├── package.json               # Dependencies & scripts
│   │   ├── tsconfig.json              # TypeScript config with @/ aliases
│   │   ├── next.config.ts             # Next.js config (standalone output)
│   │   ├── postcss.config.mjs         # PostCSS + Tailwind CSS v4
│   │   ├── eslint.config.mjs          # ESLint config (Next.js + TS)
│   │   └── playwright.config.ts       # E2E test configuration
│   ├── ci-cd/
│   │   ├── Dockerfile                 # Alternative Dockerfile for CI/CD
│   │   └── README.md                  # Deployment instructions
│   ├── tests/
│   │   ├── setup.ts                   # Global test mocks (Firebase, Gemini)
│   │   ├── unit/
│   │   │   ├── aiService.test.ts      # Mastery detection tests
│   │   │   └── Button.test.tsx        # Button component tests
│   │   ├── e2e/
│   │   │   └── auth.spec.ts           # Auth flow E2E tests
│   │   └── README.md                  # Test suite documentation
│   ├── docs/                          # ← You are here
│   └── vitest.config.ts               # Vitest runner configuration
```

---

## Data Flow

### 1. Authentication Flow

```
User opens app
  → useAuth(false) checks Firebase auth state
  → If unauthenticated → LandingPage rendered
  → If authenticated → Sidebar + ChatContainer rendered

User clicks "Get Started" / "Login"
  → Navigates to /login
  → Enters email/password OR clicks Google Sign-In
  → Firebase Auth processes credentials
  → onAuthStateChanged fires → useAuth updates → redirect to /
```

### 2. Chat / Learning Flow

```
User types a message and submits
  → ChatContainer sends POST /api/chat with { messages[], userId }
  → Route handler validates input
  → aiService.getStratResponseStream() called:
      → Creates Gemini chat session with SYSTEM_PROMPT
      → Sends message history + latest user input
      → Returns streaming response iterator
  → Route handler wraps stream in ReadableStream
  → Client reads stream chunks, updating UI in real-time
  → After stream completes:
      → handleMasteryDetection() scans response for [MASTERY: X] tags
      → If found → writes to Firestore: users/{uid}/progress/mastery
      → Sidebar's onSnapshot listener fires → UI updates with mastered concept
```

### 3. Mastery Tracking Flow

```
Gemini response contains "[MASTERY: Quantum Computing]"
  → handleMasteryDetection() extracts concept name via regex
  → Checks Firestore document: users/{uid}/progress/mastery
  → If doc doesn't exist → setDoc() creates it with mastered: [concept]
  → If doc exists → updateDoc() with arrayUnion(concept)
  → Sidebar component has live onSnapshot listener on same path
  → UI auto-updates to show new mastered concept with animation
```

---

## Technology Decisions

| Decision | Rationale |
|---|---|
| **Next.js 16 App Router** | Server-side Route Handlers enable streaming without a separate backend; `output: 'standalone'` produces minimal Docker images |
| **Gemini `sendMessageStream`** | Token-by-token streaming gives instant feedback to learners, reducing perceived latency |
| **Firebase Auth** | Zero-config auth provider with Google Sign-In support; client-side SDK integrates naturally with React |
| **Firebase Firestore** | Real-time `onSnapshot` listeners enable live mastery tracking in the sidebar without polling |
| **Tailwind CSS v4** | `@theme` directive allows centralized design token management; Stitch Design Tokens ensure visual consistency |
| **pnpm** | Faster installs and strict dependency isolation compared to npm/yarn |
| **TypeScript strict mode** | Catches type errors at compile time; interfaces in `types/` enforce data contracts across the codebase |

---

## Module Dependency Graph

```
app/page.tsx
  ├── hooks/useAuth.ts → lib/firebase.ts
  ├── components/layout/Sidebar.tsx → lib/firebase.ts, components/ui/Button.tsx
  ├── components/chat/ChatContainer.tsx → types/chat.ts, components/ui/Button.tsx
  └── components/features/LandingPage.tsx → components/ui/Button.tsx

app/login/page.tsx
  ├── lib/firebase.ts
  └── components/ui/Button.tsx

app/api/chat/route.ts
  └── services/aiService.ts
        ├── lib/gemini.ts
        ├── lib/firebase.ts
        ├── constants/prompts.ts
        └── types/chat.ts
```
