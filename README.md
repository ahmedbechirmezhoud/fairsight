# Mobile Developer - Technical Test

## About FairFleet

FairFleet is a platform for drone-based inspections. We help clients inspect solar panels, rooftops, facades, and infrastructure using drone imagery and AI-powered analysis.

## The Challenge

Build a mobile application: **Drone Inspection Report Viewer**

You have **5 days** from receiving this test. We value quality over completeness - a polished subset is better than a half-finished whole.

## Requirements

### Core (must have)

1. **Report List Screen**
   - Fetch and display inspection reports from the provided mock API
   - Show: report title, date, location, status, thumbnail
   - Search by title or location
   - Filter by status (completed, in_progress, pending_review)

2. **Report Detail Screen**
   - Display all report metadata
   - Show inspection images in a gallery/carousel
   - Show the inspection location on a map (use the GPS coordinates from the API)

3. **AI Feature** (pick ONE, your choice)

   **Option A - Image Analysis:**
   Integrate an AI vision model (on-device or cloud) to classify inspection images. Example labels: "damage_detected", "clean", "debris", "crack", "discoloration". Display the classification result on each image.

   **Option B - Chat Assistant:**
   Add a chat interface where the user can ask questions about a selected report (e.g. "What issues were found?", "Summarize this inspection"). Use an LLM API (Claude, OpenAI, or similar) to generate responses using the report data as context.

   **Option C - Smart Summary:**
   Auto-generate a natural language summary for each report using an LLM. The summary should describe the inspection findings, highlight any issues, and suggest next steps. Display it prominently on the detail screen.

### Bonus (nice to have, not required)

- Offline support with local caching
- Pull-to-refresh
- Map view showing all inspection locations with clustered pins
- Dark mode
- Unit tests on core business logic
- CI/CD pipeline configuration
- Accessibility support

## Tech Stack

**Your choice.** Pick whatever you're most productive with:
- Flutter, React Native, SwiftUI, Kotlin/Jetpack Compose, etc.

We care more about your architectural decisions than the specific framework. Be ready to explain why you chose what you chose.

## Mock API

A local mock API server is provided in the `mock-api/` folder.

### Quick start

```bash
cd mock-api

# Option 1: Docker (recommended)
docker compose up

# Option 2: Node.js (16+)
npm install
npm start
```

**Base URL:** `http://localhost:3000`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/reports` | List all reports (supports `?status=`, `?search=` query params) |
| GET | `/api/reports/:id` | Get a single report with full details |
| GET | `/api/reports/:id/images` | Get images for a report |
| GET | `/images/:filename` | Serve a static image file |

See `mock-api/api-spec.yaml` for the full OpenAPI specification.

## What We Evaluate

| Area | Weight | What we look for |
|------|--------|-----------------|
| **Architecture** | 25% | Clean separation of concerns, state management, dependency injection |
| **AI Integration** | 25% | Thoughtful integration, prompt design, error handling, UX around AI features |
| **UI/UX** | 20% | Polished, responsive, proper loading/error/empty states |
| **Code Quality** | 20% | Readable, maintainable, appropriate abstractions (not over-engineered) |
| **Tech Choices** | 10% | Can you justify your decisions? |

## Deliverables

1. A **Git repository** (GitHub, GitLab, or Bitbucket) with your code
2. A **README** in your repo explaining:
   - How to build and run the app
   - Your tech stack choices and why
   - Your approach to the AI feature
   - What you would improve given more time
3. A **short screen recording** (2-3 min) demoing the app

## Rules

- You may use any open-source libraries
- You may use AI coding assistants for development (we do too)
- If using a cloud AI API, include setup instructions but do NOT commit API keys
- Ask questions if anything is unclear - reaching out is a positive signal

## Questions?

Reply to the email thread you received this test from. We typically respond within a few hours.

Good luck!
