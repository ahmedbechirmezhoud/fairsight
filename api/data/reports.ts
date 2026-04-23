import path from "path"
import fs from "fs"
import type { Report, ReportSummary } from "../types"

const reportsPath = path.join(__dirname, "reports.json")
let reports: Report[] = []

try {
  reports = JSON.parse(fs.readFileSync(reportsPath, "utf-8")) as Report[]
} catch (err) {
  console.error("Could not load reports.json:", (err as Error).message)
  console.error("Make sure data/reports.json exists.")
  process.exit(1)
}

export const summaries: ReportSummary[] = reports.map((r) => ({
  id: r.id,
  title: r.title,
  date: r.date,
  status: r.status,
  location: r.location,
  inspection_type: r.inspection_type,
  thumbnail: r.thumbnail,
  issues_count: r.issues ? r.issues.length : 0,
  coordinates: r.coordinates,
}))

export function findById(id: string): Report | null {
  return reports.find((r) => r.id === id) ?? null
}

export { reports }
