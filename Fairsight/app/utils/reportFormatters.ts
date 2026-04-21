/**
 * Centralized formatters for report domain values.
 * All display formatting goes here — no inline formatting in components.
 */
import { formatDate } from "./formatDate"

/** "Sep 23, 2022" — locale-aware via formatDate */
export function formatReportDate(dateString: string): string {
  return formatDate(dateString, "MMM dd, yyyy")
}

/** "18.5°C" */
export function formatTemperature(celsius: number): string {
  return `${celsius}°C`
}

/** "12 km/h" */
export function formatWindSpeed(kmh: number): string {
  return `${kmh} km/h`
}

/** "3,200 m²" */
export function formatArea(sqm: number): string {
  return `${sqm.toLocaleString()} m²`
}

/** "25 m" */
export function formatAltitude(meters: number): string {
  return `${meters} m`
}

/** "42 min" */
export function formatDuration(minutes: number): string {
  return `${minutes} min`
}

/** "5 issues" / "1 issue" */
export function formatIssueCount(count: number): string {
  return `${count} ${count === 1 ? "issue" : "issues"}`
}
