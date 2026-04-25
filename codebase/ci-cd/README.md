# Strat CI/CD & Deployment

This directory contains the necessary configurations for containerizing and deploying the Strat application.

## Docker Deployment

The `Dockerfile` is optimized for Google Cloud Run using Next.js standalone output.

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
docker run -p 3000:3000 strat-app
```

## Google Cloud Run Deployment

To deploy directly to Google Cloud Run from the `app-code` directory:

```bash
gcloud run deploy strat-app --source . --dockerfile ../ci-cd/Dockerfile
```

## Continuous Integration

- **Testing**: Automated unit and E2E tests are located in the `/tests` folder.
- **Standalone Build**: The Next.js config is set to `output: 'standalone'` for efficient production containers.
