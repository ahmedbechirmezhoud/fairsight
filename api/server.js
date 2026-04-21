const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static images
app.use("/images", express.static(path.join(__dirname, "images")));

// Load mock data
const reportsPath = path.join(__dirname, "data", "reports.json");
let reports = [];

try {
  reports = JSON.parse(fs.readFileSync(reportsPath, "utf-8"));
} catch (err) {
  console.error("Could not load reports.json:", err.message);
  console.error("Make sure data/reports.json exists.");
  process.exit(1);
}

// GET /api/reports
app.get("/api/reports", (req, res) => {
  const { status, search } = req.query;
  let filtered = [...reports];

  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.location.toLowerCase().includes(term)
    );
  }

  // Return summaries only (no full details)
  const summaries = filtered.map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date,
    status: r.status,
    location: r.location,
    inspection_type: r.inspection_type,
    thumbnail: r.thumbnail,
    issues_count: r.issues ? r.issues.length : 0,
  }));

  res.json({ reports: summaries, total: summaries.length });
});

// GET /api/reports/:id
app.get("/api/reports/:id", (req, res) => {
  const report = reports.find((r) => r.id === req.params.id);

  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  const { images, ...detail } = report;
  detail.issues_count = detail.issues ? detail.issues.length : 0;

  res.json(detail);
});

// GET /api/reports/:id/images
app.get("/api/reports/:id/images", (req, res) => {
  const report = reports.find((r) => r.id === req.params.id);

  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.json({ images: report.images || [] });
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
  console.log(`Loaded ${reports.length} reports`);
  console.log(`Images served from ${path.join(__dirname, "images")}`);
});
