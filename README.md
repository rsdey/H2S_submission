# Strat — Adaptive Learning Assistant

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
| Outdated learning resources | Live Google Search grounding for current information |
| No structured study plans | AI-generated learning roadmaps with Excel download |

---

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) | Server-side rendering, API routes, streaming |
| **AI Engine** | Google Gemini (via `@google/generative-ai`) | Socratic response generation with streaming |
| **Search** | Google Search (Gemini Grounding) | Real-time web search for latest tech info |
| **Authentication** | Firebase Authentication | Secure user sign-in (Email/Password + Google) |
| **Database** | Firebase Firestore | Persistent storage for mastery progress & learning history |
| **Styling** | Tailwind CSS 4 + Custom Stitch Design Tokens | Accessible, themeable component library |
| **Testing** | Vitest (Unit) + Playwright (E2E) | Automated quality assurance |
| **Deployment** | Google Cloud Run (Docker) | Scalable, serverless container hosting |

---

## ✨ Key Features

### 1. Socratic AI Tutor
The core pedagogical engine uses the **Strat Method** — a structured approach where the AI never gives direct answers. Instead, it:
- Analyzes the learner's current understanding
- Scaffolds complex topics into atomic concepts
- Asks ONE strategic question at a time to guide discovery
- Adapts difficulty based on responses (easier hints or harder challenges)

### 2. Real-Time Mastery Detection
When a student demonstrates clear understanding, the AI automatically:
- Tags the response with `[MASTERY: Concept Name]`
- Persists the mastered concept to Firestore (`users/{uid}/progress/mastery`)
- Triggers a live "Achievement Unlocked" badge in the chat
- Updates the sidebar's mastery tracker in real-time via Firestore `onSnapshot`

### 3. Google Search Grounding 🔍
The Gemini model has access to **live Google Search**, enabling it to:
- Provide up-to-date information about latest frameworks, libraries, and tools
- Verify facts and cite current documentation
- Answer questions about recent releases, version numbers, and industry trends

### 4. Smart Resource Recommendations 📚
When a user says "I want to learn X", the AI generates structured resource cards:
- **Udemy Course Links** — 2-3 relevant courses with direct links
- **Reading Articles** — 2-3 articles from reputable sources (MDN, freeCodeCamp, official docs, etc.)
- Cards are rendered as clickable, styled blocks with icons and hover effects

### 5. Downloadable Learning Plans 📋
When a user asks for a "learning plan" or "roadmap", the AI generates:
- A structured **week-by-week roadmap** displayed as an in-chat table
- **Excel-compatible CSV download** with columns:
  - Week | Days | Topic/Module | Activity | Duration | Resources | Status | Notes | Date Started | Date Completed
- Activity tracking columns for learners to fill in as they progress

---

## 🏗️ Code Quality — Production Standardized

The codebase follows **clean architecture** patterns with strict separation of concerns:

```
codebase/
├── app-code/                 # Application source
│   ├── app/                  # Next.js App Router (pages & API routes)
│   │   ├── api/chat/         # Server-side streaming endpoint
│   │   ├── login/            # Authentication page (Email + Google Sign-In)
│   │   └── page.tsx          # Landing page / authenticated app entry
│   ├── components/           # Modular UI components
│   │   ├── chat/             # ChatContainer (streaming, resources, learning plans)
│   │   ├── features/         # LandingPage with hero, features grid, CTA
│   │   ├── layout/           # Sidebar with live mastery tracker
│   │   └── ui/               # Button (5 variants, 4 sizes, ref forwarding)
│   ├── constants/            # AI system prompt with structured output formats
│   ├── hooks/                # Custom React hooks (useAuth with optional redirect)
│   ├── lib/                  # SDK initialization (Firebase, Gemini with lazy init)
│   ├── services/             # AI business logic + mastery detection + search
│   └── types/                # TypeScript interfaces & type definitions
├── ci-cd/                    # Dockerfile & deployment configs
├── docs/                     # Comprehensive technical documentation
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
- **Lazy SDK Initialization** — The Gemini SDK uses lazy init to prevent build-time errors when env vars aren't available (critical for Docker builds).

---

## 🔒 Security

Security is a first-class concern across the entire stack:

- **Server-Side API Keys** — All sensitive credentials (`GEMINI_API_KEY`, Firebase service config) are stored exclusively in environment variables (`.env.local`) and are **never** exposed to the client bundle.
- **API Route Protection** — The `/api/chat` endpoint runs entirely server-side via Next.js Route Handlers. Client code never touches the Gemini SDK directly.
- **Firebase Authentication** — User identity is managed through Firebase Auth with email/password and Google Sign-In. The `useAuth()` hook wraps `onAuthStateChanged` to provide real-time session state.
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
- **Webpack Production Build** — Docker builds use `--webpack` flag for stable, production-grade alias resolution (Turbopack is used only in local dev).
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
| **Google Search (Grounding)** | Integrated as a Gemini tool (`googleSearch`) to provide real-time web search for latest tech info, current documentation, and up-to-date facts. |
| **Firebase Authentication** | Manages user accounts with email/password and Google Sign-In. Session state is tracked client-side via `onAuthStateChanged`. |
| **Firebase Firestore** | Persists user learning progress, mastery records, and chat history under per-user document paths. Real-time `onSnapshot` listeners power live UI updates. |
| **Google Cloud Run** | Production deployment target. The app is containerized with Docker and optimized for Cloud Run's serverless scaling model. |
| **Vertex AI** | Enterprise-grade AI platform for fine-tuning custom models, MLOps, and deploying robust Vector Search databases for Retrieval-Augmented Generation (RAG). |
| **Vertex AI Search and Conversation** | Fully managed services to quickly build GenAI search engines and chat agents over enterprise data. |
| **Google Cloud Storage / Firebase Storage** | Scalable object storage for handling user document uploads (PDFs, images) to be processed by multimodal AI models. |
| **Google Cloud Speech-to-Text & Text-to-Speech** | Enabling voice-driven, interactive AI conversational interfaces. |
| **Google Cloud Translation API** | Adding seamless, real-time multilingual capabilities to AI chat interfaces. |
| **Cloud Functions / Firebase Cloud Functions** | Serverless event-driven functions for asynchronous AI processing, webhooks, or scheduled model evaluations. |
| **BigQuery** | Serverless data warehouse for running advanced analytics on AI chat logs, user mastery trends, and engagement metrics at scale. |
| **Firebase App Check** | Protecting backend AI APIs and cloud resources from abuse, billing fraud, and unauthorized clients. |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Setup
```bash
cd codebase/app-code
pnpm install

# Create .env.local with your credentials:
# GEMINI_API_KEY=your_key
# NEXT_PUBLIC_FIREBASE_API_KEY=your_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start your learning journey.

### Deployment

To deploy to Google Cloud Run, run the following from the **`app-code/`** directory:

```bash
cd app-code
gcloud run deploy strat-app --source . --dockerfile ../ci-cd/Dockerfile
```

Alternatively, from the **`codebase/`** root:
```bash
docker build -f ci-cd/Dockerfile ./app-code -t strat-app
```

> **Note**: Docker builds use `pnpm next build --webpack` to ensure stable alias resolution. The Gemini SDK uses lazy initialization so API keys aren't required at build time.

---

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](codebase/docs/) directory:

| Document | Description |
|---|---|
| [Architecture Overview](codebase/docs/architecture.md) | System architecture, data flow, and design decisions |
| [API Reference](codebase/docs/api-reference.md) | REST API endpoints, request/response schemas, streaming protocol |
| [Component Guide](codebase/docs/components.md) | UI component hierarchy, props, design system tokens |
| [Setup & Configuration](codebase/docs/setup.md) | Environment setup, dependencies, env variables |
| [Deployment Guide](codebase/docs/deployment.md) | Docker build, Google Cloud Run deployment, CI/CD |
| [Testing Guide](codebase/docs/testing.md) | Unit tests, E2E tests, mocking strategy |
| [AI & Pedagogy](codebase/docs/ai-pedagogy.md) | Strat method, system prompt design, mastery detection |
| [Security](codebase/docs/security.md) | Authentication, API key management, Firestore rules |

---

## 📜 License

Built for the hackathon. © 2026 Strat AI.
