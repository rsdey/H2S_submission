# Strat - Adaptive Learning Assistant

**Strat** is an intelligent, adaptive learning assistant built for an elite hackathon. It uses the "Strat method" (a refined Socratic inquiry approach) to guide students through complex topics by asking strategic questions rather than providing direct answers.

## 🚀 Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **AI**: Google Gemini 1.5 Flash
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Styling**: Tailwind CSS 4 with custom Stitch design tokens

## 📁 Project Structure

- **`app-code/`**: Main application source code.
- **`tests/`**: Unit and E2E test suites.

## 🛠️ Getting Started

First, navigate to the `app-code` directory:

```bash
cd app-code
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start your learning journey.

## 🧪 Testing

Strat includes a comprehensive test suite. To run tests:

```bash
# Unit Tests
pnpm run test:unit

# E2E Tests
pnpm run test:e2e
```

## 📜 Principles

Strat follows the "Zone of Proximal Development" theory, scaffolding knowledge by breaking complex topics into atomic concepts and challenging students to discover the truth through inquiry.
