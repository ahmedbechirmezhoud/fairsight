import { Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"
import { imageUrl } from "@/utils/imageUrl"

import { StatusBadge } from "./StatusBadge"

interface SheetReportRowProps {
  report: ReportSummary
  onPress: (r: ReportSummary) => void
}

export function SheetReportRow({ report, onPress }: SheetReportRowProps) {
  const { themed } = useAppTheme()

  return (
    <Pressable
      onPress={() => onPress(report)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${report.title}`}
      style={themed($row)}
    >
      <Image
        source={{ uri: imageUrl(report.thumbnail) }}
        style={$thumb}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel={`Thumbnail for ${report.title}`}
      />
      <View style={themed($content)}>
        <StatusBadge status={report.status} />
        <Text size="sm" weight="semiBold" style={themed($title)} numberOfLines={2}>
          {report.title}
        </Text>
        <Text size="xxs" style={themed($location)} numberOfLines={1}>
          {report.location}
        </Text>
      </View>
    </Pressable>
  )
}

const $row: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: "row",
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $thumb: ImageStyle = { width: 120, height: 110 }

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.sm,
  gap: spacing.xxs,
  justifyContent: "center",
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.text })

const $location: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textSubtle })
