# Bathou AI — Bodo language assistant

This repository contains a small Bodo language assistant with a Node backend and a React + Vite frontend. The project is set up to run locally with Docker and can build/publish Docker images to GitHub Container Registry (GHCR) via GitHub Actions.

Quick start (Docker):

1. Build & run locally with docker-compose:

```bash
docker-compose build
docker-compose up
```

- The frontend will be available at http://localhost:5173
- The backend will be available at http://localhost:5000

2. Pull published images from GHCR (if CI pushed images):

```bash
docker pull ghcr.io/<your-org>/bathou-ai-backend:latest
docker pull ghcr.io/<your-org>/bathou-ai-frontend:latest

docker run -p 5000:5000 ghcr.io/<your-org>/bathou-ai-backend:latest
docker run -p 5173:80 ghcr.io/<your-org>/bathou-ai-frontend:latest
```

GitHub Actions:
- On push to `main`, the workflow `docker-publish.yml` builds and pushes images to GHCR: `ghcr.io/<owner>/bathou-ai-backend` and `ghcr.io/<owner>/bathou-ai-frontend`.

Notes:
- The frontend uses a relative API path `/api/chat`; the Nginx config in the Docker image proxies `/api` to the backend service when using Docker Compose.
- To allow GitHub Actions to push to GHCR, ensure `packages: write` permission and `GITHUB_TOKEN` has package write access (default for repositories should work). If you prefer pushing to a personal registry, create a `GHCR_PAT` secret and update the workflow to use it.
