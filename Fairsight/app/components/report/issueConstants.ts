import type { Issue, IssueSeverity } from "@/types/api"

export const SEVERITY_LABEL: Record<IssueSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
}

export const CATEGORY_LABEL: Record<Issue["category"], string> = {
  missing_object: "Missing object",
  soiling: "Soiling",
  damage: "Damage",
}
