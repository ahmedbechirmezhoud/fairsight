# Mock API Server

A simple Express server that serves drone inspection report data.

## Setup

### Option 1: Docker (recommended)

```bash
cd mock-api
docker compose up
```

### Option 2: Node.js

Requires Node.js 16+.

```bash
cd mock-api
npm install
npm start
```

The server runs at `http://localhost:3000` by default.

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm start
```

## Endpoints

- `GET /api/reports` - List reports (query: `?status=`, `?search=`)
- `GET /api/reports/:id` - Report details (includes issues array)
- `GET /api/reports/:id/images` - Images for a report
- `GET /images/:filename` - Static image files

## Data

- **4 inspection reports** with different statuses (completed, in_progress, pending_review)
- **24 high-resolution drone images** (5472x3648, JPEG)
- **15 annotated issues** across the reports (critical, warning, info)
- Report data lives in `data/reports.json`
- Images live in `images/`

See `api-spec.yaml` for the full OpenAPI specification.
