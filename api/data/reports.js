const path = require("path");
const fs = require("fs");

const reportsPath = path.join(__dirname, "reports.json");
let reports = [];

try {
  reports = JSON.parse(fs.readFileSync(reportsPath, "utf-8"));
} catch (err) {
  console.error("Could not load reports.json:", err.message);
  console.error("Make sure data/reports.json exists.");
  process.exit(1);
}

const summaries = reports.map((r) => ({
  id: r.id,
  title: r.title,
  date: r.date,
  status: r.status,
  location: r.location,
  inspection_type: r.inspection_type,
  thumbnail: r.thumbnail,
  issues_count: r.issues ? r.issues.length : 0,
  coordinates: r.coordinates,
}));

function findById(id) {
  return reports.find((r) => r.id === id) || null;
}

module.exports = { reports, summaries, findById };
