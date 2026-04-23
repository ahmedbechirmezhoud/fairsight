import { View, ViewStyle, TextStyle } from "react-native"

import { StatusBadge } from "@/components/report/StatusBadge"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportStatus } from "@/types/api"
import { formatReportDate } from "@/utils/reportFormatters"

interface ChatReportHeaderProps {
  title: string
  date: string
  location: string
  status: ReportStatus
}

export function ChatReportHeader({ title, date, location, status }: ChatReportHeaderProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($card)}>
      <View style={$row}>
        <StatusBadge status={status} />
        <Text size="xxs" style={themed($date)}>
          {formatReportDate(date)}
        </Text>
      </View>
      <Text size="xs" weight="semiBold" style={themed($title)} numberOfLines={2}>
        {title}
      </Text>
      <Text size="xxs" style={themed($location)} numberOfLines={1}>
        {location}
      </Text>
    </View>
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: 4,
})

const $row: ViewStyle = { flexDirection: "row", alignItems: "center", gap: 8 }

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.text })
const $date: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textSubtle })
const $location: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textDim })
