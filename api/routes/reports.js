const { Router } = require("express");
const { z } = require("zod");
const { summaries, findById } = require("../data/reports");
const { validate } = require("../middleware/validate");

const router = Router();

const querySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
});

router.get("/", validate(querySchema, "query"), (req, res) => {
  const { status, search } = req.query;
  let filtered = summaries;

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

  res.json({ reports: filtered, total: filtered.length });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const report = findById(id);

  if (!report) return res.status(404).json({ error: "Report not found" });

  const { images, ...detail } = report;
  res.json({ ...detail, issues_count: detail.issues ? detail.issues.length : 0 });
});

router.get("/:id/images", (req, res) => {
  const { id } = req.params;
  const report = findById(id);

  if (!report) return res.status(404).json({ error: "Report not found" });

  res.json({ images: report.images || [] });
});

module.exports = router;
