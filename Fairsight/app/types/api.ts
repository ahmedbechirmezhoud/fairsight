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
  url: string
  type: ImageType
  captured_at: string
  width: number
  height: number
  issue_refs: string[]
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
}

export interface ReportDetail extends ReportSummary {
  description: string
  client: string
  inspector: string
  coordinates: {
    latitude: number
    longitude: number
  }
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
}

// API response envelopes
export interface ReportsListResponse {
  reports: ReportSummary[]
  total: number
}

export interface ReportImagesResponse {
  images: ReportImage[]
}
