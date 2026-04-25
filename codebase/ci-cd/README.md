# Strat CI/CD & Deployment

This directory contains the necessary configurations for containerizing and deploying the Strat application.

## Docker Deployment

The `Dockerfile` is optimized for Google Cloud Run using Next.js standalone output with a multi-stage build (deps → builder → runner).

### Important Build Notes

- **Webpack Build**: The Dockerfile uses `pnpm next build --webpack` instead of the default Turbopack. This is required because Turbopack has issues resolving `@/*` path aliases in container environments.
- **Lazy SDK Init**: The Gemini SDK uses lazy initialization (`getGenAI()` factory) so that `GEMINI_API_KEY` is not required at build time — only at runtime.
- **Non-Root User**: The production container runs as a dedicated `nextjs` user (UID 1001), not root.

### Building the Image

To build the image, run the following command from the **root of the `app-code` directory**:

```bash
docker build -f ../ci-cd/Dockerfile . -t strat-app
```

Alternatively, from the **root of the `codebase` directory**:

```bash
docker build -f ci-cd/Dockerfile ./app-code -t strat-app
```

### Running Locally

```bash
docker run -p 3000:3000 --env-file app-code/.env.local strat-app
```

### Required Environment Variables

These must be provided at **runtime** (not build time):

```
GEMINI_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note**: `NEXT_PUBLIC_*` variables are inlined into the client bundle at build time by Next.js. For Docker builds, pass them as build args or set them before the build step if client-side Firebase needs to work.

## Google Cloud Run Deployment

To deploy directly to Google Cloud Run from the `app-code` directory:

```bash
gcloud run deploy strat-app \
  --source . \
  --dockerfile ../ci-cd/Dockerfile \
  --set-env-vars "GEMINI_API_KEY=your_key"
```

Set all Firebase environment variables via the Cloud Run console or `--set-env-vars` flag.

## Continuous Integration

- **Testing**: Automated unit (Vitest) and E2E (Playwright) tests are located in the `/tests` folder.
- **Standalone Build**: The Next.js config is set to `output: 'standalone'` for efficient production containers.
- **Build Verification**: Run `pnpm next build --webpack` locally before pushing to validate the build.
