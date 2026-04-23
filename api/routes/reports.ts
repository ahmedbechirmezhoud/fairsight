import { Router } from "express"
import { z } from "zod"
import { summaries, findById } from "../data/reports"
import { validate } from "../middleware/validate"

const router = Router()

const querySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
})

router.get("/", validate(querySchema, "query"), (req, res) => {
  const { status, search } = req.query as z.infer<typeof querySchema>
  let filtered = summaries

  if (status) {
    filtered = filtered.filter((r) => r.status === status)
  }

  if (search) {
    const term = search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(term) || r.location.toLowerCase().includes(term),
    )
  }

  res.json({ reports: filtered, total: filtered.length })
})

router.get("/:id", (req, res) => {
  const { id } = req.params
  const report = findById(id)

  if (!report) {
    res.status(404).json({ error: "Report not found" })
    return
  }

  const { images: _images, ...detail } = report
  res.json({ ...detail, issues_count: detail.issues ? detail.issues.length : 0 })
})

router.get("/:id/images", (req, res) => {
  const { id } = req.params
  const report = findById(id)

  if (!report) {
    res.status(404).json({ error: "Report not found" })
    return
  }

  res.json({ images: report.images ?? [] })
})

export default router
