# Fairsight — API

Mock API server for the Fairsight mobile app. Serves inspection report data and hosts the AI chat endpoint. Support layer for the mobile evaluation; the goal is minimum viable complexity.

---

## Setup

```bash
cp .env.example .env  # add your OPENAI_API_KEY
npm install
npm start             # http://localhost:3000
```

To use a different port:

```bash
PORT=3001 npm start
```

---

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/reports` | List reports. Supports `?search=` and `?status=` |
| GET | `/api/reports/:id` | Single report with full detail |
| GET | `/api/reports/:id/images` | Images for a report |
| GET | `/images/:filename` | Static image file |
| POST | `/api/conversations` | Create a conversation for a report |
| POST | `/api/conversations/:id/messages` | Send a message, streams response via SSE |
| GET | `/api/conversations/:id` | Conversation history |

---

## Data

- 4 inspection reports (completed, in_progress, pending_review)
- 24 high-resolution drone images
- 15 annotated issues across reports (critical, warning, info)
- Report data lives in `data/reports.json`, images in `images/`

---

## Structure

```
api/
├── data/           In-memory report dataset
├── routes/         Express routers — reports and conversations
├── services/       AI streaming and system prompt construction
├── middleware/     Request validation (Zod) and error handling
├── store/          In-memory conversation state
├── types/          Shared TypeScript interfaces
├── config.ts       Environment variable loading
└── server.ts       Entry point
```

---

## Notes

- No database. Report data and conversations are in memory and reset on restart.
- TypeScript runs directly via `tsx`, no build step needed.
- The chat endpoint streams tokens over SSE; connection stays open until the model finishes.
