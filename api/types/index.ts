// ─── Domain types (mirror app/types/api.ts) ──────────────────────────────────

export type IssueSeverity = "critical" | "warning" | "info"
export type IssueCategory = "missing_object" | "soiling" | "damage"
export type ReportStatus = "completed" | "pending_review" | "in_progress"
export type InspectionType = "facade" | "rooftop"
export type ImageType = "rgb" | "overview"

export interface Issue {
  id: string
  severity: IssueSeverity
  category: IssueCategory
  description: string
  image_ref: string
  location_on_site: string
}

export interface ReportImage {
  id: string
  filename: string
  type: ImageType
  captured_at: string
  width: number
  height: number
  issue_refs: string[]
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Report {
  id: string
  title: string
  date: string
  status: ReportStatus
  location: string
  inspection_type: InspectionType
  thumbnail: string
  coordinates: Coordinates
  description: string
  client: string
  inspector: string
  area_sqm: number
  weather: {
    temperature_c: number
    wind_speed_kmh: number
    conditions: string
  }
  drone: {
    model: string
    flight_altitude_m: number
    flight_duration_min: number
  }
  issues: Issue[]
  images: ReportImage[]
}

export interface ReportSummary {
  id: string
  title: string
  date: string
  status: ReportStatus
  location: string
  inspection_type: InspectionType
  thumbnail: string
  issues_count: number
  coordinates: Coordinates
}

// ─── Store types ──────────────────────────────────────────────────────────────

export interface Conversation {
  id: string
  reportId: string
  systemPrompt: string
  createdAt: string
}

export interface StoredMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

// ─── Service types ────────────────────────────────────────────────────────────

export interface StreamChatParams {
  systemPrompt: string
  history: Array<{ role: "user" | "assistant"; content: string }>
  userContent: string
  abortSignal?: AbortSignal
}
