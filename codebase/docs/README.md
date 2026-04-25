# Strat — Technical Documentation

> Comprehensive documentation for the Strat Adaptive Learning Assistant.

## Documentation Index

| Document | Description |
|---|---|
| [Architecture Overview](./architecture.md) | System architecture, data flow, and high-level design decisions |
| [API Reference](./api-reference.md) | REST API endpoints, request/response schemas, streaming protocol |
| [Component Guide](./components.md) | UI component hierarchy, props, design system tokens |
| [Setup & Configuration](./setup.md) | Environment setup, dependencies, env variables, local development |
| [Deployment Guide](./deployment.md) | Docker build, Google Cloud Run deployment, CI/CD pipeline |
| [Testing Guide](./testing.md) | Unit tests, E2E tests, mocking strategy, running test suites |
| [AI & Pedagogy](./ai-pedagogy.md) | Strat method, system prompt design, mastery detection algorithm |
| [Security](./security.md) | Authentication, API key management, Firestore rules, Docker hardening |

---

## Quick Start

```bash
cd codebase/app-code
pnpm install
# Create .env.local (see setup.md for all required variables)
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).
