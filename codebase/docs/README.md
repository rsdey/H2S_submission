# Strat — Technical Documentation

> Comprehensive documentation for the Strat Adaptive Learning Assistant.

## Documentation Index

| Document | Description |
|---|---|
| [Architecture Overview](./architecture.md) | System architecture, data flow, and high-level design decisions |
| [API Reference](./api-reference.md) | REST API endpoints, request/response schemas, streaming protocol |
| [Component Guide](./components.md) | UI component hierarchy, props, design system tokens |

---

## Quick Start

```bash
cd codebase/app-code
pnpm install
# Create .env.local (see app-code README for all required variables)
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Feature Overview

| Feature | Description |
|---|---|
| **Socratic AI Tutor** | Gemini-powered tutor that guides through strategic questioning, never giving direct answers |
| **Google Search Grounding** | Live web search for latest tech info, current docs, and up-to-date facts |
| **Resource Recommendations** | Auto-generated Udemy course cards and article cards when learning a new topic |
| **Learning Plan Downloads** | AI-generated week-by-week roadmaps with Excel CSV download for activity tracking |
| **Mastery Detection** | Real-time concept mastery tracking persisted to Firestore with live sidebar updates |
| **Firebase Auth** | Email/password + Google Sign-In with protected route support |

---

## Build & Deploy

```bash
# Local dev (Turbopack)
pnpm run dev

# Production build (Webpack — required for Docker/CI)
pnpm next build --webpack

# Docker
docker build -t strat-app .
docker run -p 3000:3000 --env-file .env.local strat-app

# Google Cloud Run
gcloud run deploy strat-app --source . --dockerfile ../ci-cd/Dockerfile
```
