import { TouchableOpacity, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

import { ReportCardBody } from "./ReportCardBody"
import { ReportCardHeader } from "./ReportCardHeader"
import { ReportThumbnail } from "./ReportThumbnail"

interface ReportCardProps {
  report: ReportSummary
  onPress: (report: ReportSummary) => void
}

export function ReportCard({ report, onPress }: ReportCardProps) {
  const { themed } = useAppTheme()

  return (
    <TouchableOpacity
      style={themed($card)}
      onPress={() => onPress(report)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Open report: ${report.title}`}
      accessibilityHint="Opens the full inspection report"
    >
      <ReportThumbnail uri={report.thumbnail} roundedTop />
      <ReportCardHeader
        title={report.title}
        status={report.status}
        inspectionType={report.inspection_type}
        date={report.date}
        subtitle={report.location}
      />
      <ReportCardBody issuesCount={report.issues_count} />
    </TouchableOpacity>
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.lg,
  marginHorizontal: spacing.md,
  overflow: "hidden",
  // elevation/1 — subtle lift
  shadowColor: colors.text,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 2,
  elevation: 1,
})
