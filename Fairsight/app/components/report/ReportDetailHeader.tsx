import { TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportDetail } from "@/types/api"
import { formatReportDate } from "@/utils/reportFormatters"

import { ReportDetailHeaderSkeleton } from "./ReportDetailSkeleton"
import { StatusBadge } from "./StatusBadge"
import { TypeBadge } from "./TypeBadge"

interface ReportDetailHeaderProps {
  report: ReportDetail | undefined
  loading: boolean
}

export function ReportDetailHeader({ report, loading }: ReportDetailHeaderProps) {
  const { themed } = useAppTheme()

  if (loading) return <ReportDetailHeaderSkeleton />
  if (!report) return null

  return (
    <View style={themed($container)}>
      <View style={$badgeRow}>
        <StatusBadge status={report.status} />
        <TypeBadge type={report.inspection_type} />
      </View>
      <Text size="xl" weight="bold" style={themed($title)}>
        {report.title}
      </Text>
      <Text size="xs" style={themed($date)}>
        {formatReportDate(report.date)}
      </Text>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  paddingBottom: spacing.sm,
  gap: spacing.xs,
})

const $badgeRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
  flexWrap: "wrap",
}

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $date: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
