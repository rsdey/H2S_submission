# H2S_submission# Strat — Adaptive Learning Assistant

> **An intelligent, AI-powered learning companion that guides learners through complex topics using the Socratic method — asking strategic questions instead of handing out answers.**

Strat was built as a production-grade hackathon submission that demonstrates how generative AI can be applied to education in a responsible, efficient, and accessible way.

---

## 📌 Problem Statement Alignment

Traditional educational tools either dump information passively or provide answers outright, short-circuiting the learning process. Strat addresses this by implementing **scaffolded inquiry** — a pedagogical approach grounded in Vygotsky's *Zone of Proximal Development* theory.

**How Strat solves this:**

| Problem | Strat's Approach |
|---|---|
| Passive content delivery | Active, question-driven dialogue |
| One-size-fits-all instruction | Adaptive scaffolding based on demonstrated understanding |
| No feedback on mastery | Real-time mastery detection with `[MASTERY]` tagging |
| Answer dependency | Socratic questioning that builds independent thinking |

---

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) | Server-side rendering, API routes, streaming |
| **AI Engine** | Google Gemini (via `@google/generative-ai`) | Socratic response generation with streaming |
| **Authentication** | Firebase Authentication | Secure user sign-in (Email/Password) |
| **Database** | Firebase Firestore | Persistent storage for mastery progress & learning history |
| **Styling** | Tailwind CSS 4 + Custom Stitch Design Tokens | Accessible, themeable component library |
| **Testing** | Vitest (Unit) + Playwright (E2E) | Automated quality assurance |
| **Deployment** | Google Cloud Run (Docker) | Scalable, serverless container hosting |

---

## 🏗️ Code Quality — Production Standardized

The codebase follows **clean architecture** patterns with strict separation of concerns:

```
codebase/
├── app-code/                 # Application source
│   ├── app/                  # Next.js App Router (pages & API routes)
│   │   ├── api/chat/         # Server-side streaming endpoint
│   │   ├── login/            # Authentication page
│   │   └── page.tsx          # Landing page / authenticated app entry
│   ├── components/           # Modular UI components
│   │   ├── chat/             # ChatContainer, MessageBubble
│   │   ├── features/         # LandingPage, MasteryTracker
│   │   ├── layout/           # Sidebar, AppShell
│   │   └── ui/               # Button, Input (design-system primitives)
│   ├── constants/            # Centralized prompts & config
│   ├── hooks/                # Custom React hooks (useAuth)
│   ├── lib/                  # SDK initialization (Firebase, Gemini)
│   ├── services/             # Business logic (aiService, firestore ops)
│   └── types/                # TypeScript interfaces & type definitions
├── ci-cd/                    # Dockerfile & deployment configs
└── tests/                    # Automated test suites
    ├── unit/                 # Vitest unit tests
    ├── e2e/                  # Playwright end-to-end tests
    └── setup.ts              # Global test mocks (Firebase, Gemini)
```

**Key practices:**
- **Strict TypeScript** — All modules use explicit type annotations; no `any` types in application code.
- **Single Responsibility** — API routes handle HTTP concerns only; business logic lives in `services/`.
- **Reusable Hooks** — Authentication state is managed via a `useAuth()` hook that supports both protected and public pages.
- **Centralized Configuration** — AI prompts, model selection, and Firebase config are isolated in `constants/` and `lib/`.

---

## 🔒 Security

Security is a first-class concern across the entire stack:

- **Server-Side API Keys** — All sensitive credentials (`GEMINI_API_KEY`, Firebase service config) are stored exclusively in environment variables (`.env.local`) and are **never** exposed to the client bundle.
- **API Route Protection** — The `/api/chat` endpoint runs entirely server-side via Next.js Route Handlers. Client code never touches the Gemini SDK directly.
- **Firebase Authentication** — User identity is managed through Firebase Auth with email/password sign-in. The `useAuth()` hook wraps `onAuthStateChanged` to provide real-time session state.
- **Firestore Security** — User mastery data is stored under a per-user document path (`users/{uid}/progress/mastery`), enabling Firestore Security Rules to enforce user-level read/write isolation.
- **`.gitignore` Enforced** — `.env.local`, `node_modules`, and `.next` are excluded from version control.
- **Non-Root Docker** — The production container runs as a dedicated `nextjs` user (UID 1001), not root.

---

## ⚡ Efficiency

The application is architected for performance at every layer:

- **Streaming Responses** — AI responses are streamed token-by-token from Google Gemini via `ReadableStream`, providing instant feedback and reducing perceived latency.
- **Next.js Standalone Build** — Production output uses `output: 'standalone'`, bundling only the files needed to run the server — no unused dependencies.
- **Multi-Stage Docker Build** — The `Dockerfile` uses three stages (deps → builder → runner) to produce a minimal Alpine-based image.
- **Static Prerendering** — The landing page and login page are statically generated at build time (`○ Static`), reducing server load for unauthenticated traffic.
- **Edge-Optimized** — The architecture is designed for deployment on Google Cloud Run, which scales containers to zero during idle periods and auto-scales under load.

---

## 🧪 Testing — Automated Quality Assurance

Strat includes a professional testing suite covering both unit and integration scenarios:

### Unit Tests (Vitest + Happy-DOM)
- **AI Service Tests** (`tests/unit/aiService.test.ts`) — Validates mastery detection regex parsing, Firestore persistence logic, and edge cases.
- **Component Tests** (`tests/unit/Button.test.tsx`) — Renders UI primitives in Happy-DOM and asserts correct props, variants, and accessibility attributes.

### End-to-End Tests (Playwright)
- **Authentication Flow** (`tests/e2e/auth.spec.ts`) — Verifies login page rendering, form validation, credential submission, and redirect behavior.

### Running Tests
```bash
# Unit tests
pnpm run test:unit

# E2E tests (requires dev server)
pnpm run test:e2e
```

---

## ♿ Accessibility

Accessibility is embedded into the component architecture:

- **Semantic HTML** — All pages use proper heading hierarchy (`h1` → `h2` → `h3`), landmark elements (`nav`, `main`, `footer`), and form labels.
- **Keyboard Navigation** — Interactive elements (buttons, inputs, links) are fully keyboard-accessible with visible focus states.
- **ARIA Attributes** — The chat interface uses `role` and `aria-label` attributes to ensure screen readers can interpret the conversational UI.
- **Color Contrast** — The design system uses WCAG-compliant contrast ratios, with the dark-mode palette specifically tuned for readability.
- **Responsive Design** — All layouts adapt from mobile to desktop breakpoints using Tailwind's responsive utilities.

---

## 🟢 Google Services Usage

Strat is built end-to-end on the Google ecosystem:

| Service | How It's Used |
|---|---|
| **Google Gemini** | Powers the Socratic AI tutor via the `@google/generative-ai` SDK. Streaming responses are generated server-side through the `sendMessageStream` API. |
| **Firebase Authentication** | Manages user accounts with email/password sign-in. Session state is tracked client-side via `onAuthStateChanged`. |
| **Firebase Firestore** | Persists user learning progress, mastery records, and chat history under per-user document paths. |
| **Google Cloud Run** | Production deployment target. The app is containerized with Docker and optimized for Cloud Run's serverless scaling model. |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Setup
```bash
cd app-code
pnpm install

# Create .env.local with your credentials:
# GEMINI_API_KEY=your_key
# NEXT_PUBLIC_FIREBASE_API_KEY=your_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
# ... (see .env.local.example)

pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start your learning journey.

### Deployment
```bash
# From app-code directory:
gcloud run deploy strat-app --source . --dockerfile ../ci-cd/Dockerfile
```

---

## 📜 License

Built for the hackathon. © 2026 Strat AI.
