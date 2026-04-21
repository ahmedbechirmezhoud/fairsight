import { TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { InspectionType, ReportStatus } from "@/types/api"

import { StatusBadge } from "./StatusBadge"

const INSPECTION_LABEL: Record<InspectionType, string> = {
  facade: "Facade",
  rooftop: "Rooftop",
}

interface ReportCardHeaderProps {
  title: string
  status: ReportStatus
  inspectionType: InspectionType
  date: string
  /** Location or client name shown below the title */
  subtitle: string
}

export function ReportCardHeader({
  title,
  status,
  inspectionType,
  date,
  subtitle,
}: ReportCardHeaderProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      {/* Status row */}
      <View style={$metaRow}>
        <StatusBadge status={status} />
        <Text size="xxs" weight="medium" style={themed($typeLabel)}>
          {INSPECTION_LABEL[inspectionType]}
        </Text>
        <Text size="xxs" style={themed($dateLabel)}>
          {date}
        </Text>
      </View>

      {/* Title */}
      <Text size="lg" weight="bold" style={themed($title)} numberOfLines={2}>
        {title}
      </Text>

      {/* Location / client */}
      <Text size="xs" style={themed($client)} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  gap: spacing.xs,
})

const $metaRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $typeLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})

const $dateLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  marginLeft: "auto",
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $client: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
