import type { Report } from "../types"

export function buildSystemPrompt(report: Report): string {
  const issues = report.issues ?? []
  const issueLines = issues
    .map(
      (i) =>
        `- [${i.severity.toUpperCase()}] ${i.category}: ${i.description} (location: ${i.location_on_site})`,
    )
    .join("\n")

  return `You are an AI assistant helping a user review and discuss a drone inspection report. Answer questions based solely on the report content below. Be concise, professional, and factual. If asked about something not covered in the report, say so clearly.

REPORT: ${report.title}
Date: ${report.date}
Location: ${report.location}
Inspection type: ${report.inspection_type}
Status: ${report.status}
Client: ${report.client}
Inspector: ${report.inspector}

Description:
${report.description}

Site area: ${report.area_sqm} sqm
Weather: ${report.weather.temperature_c}°C, wind ${report.weather.wind_speed_kmh} km/h, ${report.weather.conditions}
Drone: ${report.drone.model}, altitude ${report.drone.flight_altitude_m} m, flight duration ${report.drone.flight_duration_min} min

Issues found (${issues.length} total):
${issueLines || "None"}`
}
