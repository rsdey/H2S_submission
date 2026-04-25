# Strat — Adaptive Learning Assistant

> **An intelligent, AI-powered learning companion that guides learners through complex topics using the Socratic method — asking strategic questions instead of handing out answers.**

Strat was built as a production-grade hackathon submission that demonstrates how generative AI can be applied to education in a responsible, efficient, and accessible way.

---

## ✨ Key Features

### 🧠 Socratic AI Tutor (Strat Method)
- **Scaffolded Inquiry** — Breaks complex topics into atomic concepts and guides learners through strategic questioning
- **Adaptive Difficulty** — Adjusts hints and complexity based on demonstrated understanding
- **Never Gives Direct Answers** — Builds independent thinking through the Zone of Proximal Development

### 🏆 Real-Time Mastery Detection
- AI detects when a student masters a concept via `[MASTERY: Concept Name]` tags
- Persists progress to Firestore with live `onSnapshot` updates in the sidebar
- "Achievement Unlocked" badges animate in-chat when mastery is detected

### 🔍 Google Search Grounding
- Gemini model has access to **live Google Search** via the `googleSearch` tool
- Automatically searches for latest tech info, current docs, and up-to-date facts
- Cites sources naturally within Socratic guidance

### 📚 Smart Resource Recommendations
- Triggered when users say "I want to learn X"
- Generates **Udemy course cards** and **reading article cards** with clickable links
- Styled resource blocks with icons, hover effects, and external link indicators

### 📋 Downloadable Learning Plans
- Triggered when users ask for a "roadmap", "learning plan", or "study plan"
- Generates a **week-by-week structured roadmap** displayed as an in-chat table
- **Excel download** (CSV) with activity tracking columns:
  - Week | Days | Topic | Activity | Duration | Resources | Status | Notes | Date Started | Date Completed

### 🔐 Secure Authentication
- Firebase Auth with **Email/Password** and **Google Sign-In**
- Protected routes with optional redirect via `useAuth()` hook
- Glassmorphism login page with animated transitions

---

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) | Server-side rendering, API routes, streaming |
| **AI Engine** | Google Gemini (`@google/generative-ai`) | Socratic response generation with streaming |
| **Search** | Google Search (Gemini Grounding) | Real-time web search for current information |
| **Authentication** | Firebase Authentication | Email/Password + Google Sign-In |
| **Database** | Firebase Firestore | Mastery progress with real-time `onSnapshot` |
| **Styling** | Tailwind CSS 4 + Stitch Design Tokens | Themeable design system with custom tokens |
| **Animations** | Framer Motion | Entrance animations, staggered reveals, chat bubbles |
| **Testing** | Vitest (Unit) + Playwright (E2E) | Automated quality assurance |
| **Deployment** | Google Cloud Run (Docker) | Scalable, serverless container hosting |

---

## 📁 Project Structure

```
app-code/
├── app/
│   ├── layout.tsx             # Root layout (Inter + Space Grotesk fonts)
│   ├── page.tsx               # Home — landing or chat based on auth state
│   ├── globals.css            # Tailwind v4 @theme tokens + custom utilities
│   ├── login/page.tsx         # Auth page (email/password + Google Sign-In)
│   └── api/chat/route.ts      # Streaming chat API (POST, ReadableStream)
├── components/
│   ├── chat/ChatContainer.tsx  # Chat UI + resource cards + learning plans
│   ├── features/LandingPage.tsx # Public landing with hero, features, CTA
│   ├── layout/Sidebar.tsx      # Nav sidebar + live mastery tracker
│   └── ui/Button.tsx           # Design-system button (5 variants, 4 sizes)
├── constants/prompts.ts        # AI system prompt (Strat method + structured outputs)
├── hooks/useAuth.ts            # Firebase auth hook with optional redirect
├── lib/
│   ├── firebase.ts             # Firebase SDK init (client-side)
│   └── gemini.ts               # Gemini SDK init (lazy, server-side only)
├── services/aiService.ts       # AI logic + Google Search + mastery detection
├── types/chat.ts               # TypeScript interfaces
├── Dockerfile                  # Production multi-stage Docker build
├── next.config.ts              # standalone output mode
└── tsconfig.json               # @/* alias → ./app-code root
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Setup
```bash
pnpm install

# Create .env.local:
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production
```bash
pnpm next build --webpack
```

> **Note**: Use `--webpack` flag for production builds. Turbopack (default in Next.js 16) has issues resolving `@/*` path aliases in container environments.

### Docker Build
```bash
docker build -t strat-app .
docker run -p 3000:3000 --env-file .env.local strat-app
```

---

## 🧪 Testing

```bash
# Unit tests (Vitest + Happy-DOM)
pnpm run test:unit

# E2E tests (Playwright — requires dev server running)
pnpm run test:e2e
```

---

## 📖 Documentation

See the [`docs/`](../docs/) directory for comprehensive documentation:
- Architecture Overview
- API Reference
- Component Guide
- Setup & Configuration
- Deployment Guide
- Testing Guide
- AI & Pedagogy
- Security

---

## 📜 License

Built for the hackathon. © 2026 Strat AI.
