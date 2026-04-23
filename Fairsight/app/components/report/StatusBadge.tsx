import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportStatus } from "@/types/api"

interface StatusBadgeProps {
  status: ReportStatus
}

const STATUS_LABEL: Record<ReportStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  pending_review: "Pending Review",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { themed } = useAppTheme()

  return (
    <View
      style={themed($badge[status])}
      accessible={true}
      accessibilityLabel={`Status: ${STATUS_LABEL[status]}`}
    >
      <Text style={themed($label[status])} size="xxs" weight="semiBold">
        {STATUS_LABEL[status]}
      </Text>
    </View>
  )
}

// — completed: filled near-black pill — strong "done" signal
const $badgeCompleted: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.text,
  borderRadius: radius.full,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  alignSelf: "flex-start",
})
const $labelCompleted: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textInverse,
})

// — in_progress: warm grey — neutral "in flight" signal
const $badgeInProgress: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.full,
  borderWidth: 1,
  borderColor: colors.border,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  alignSelf: "flex-start",
})
const $labelInProgress: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

// — pending_review: amber tint — single accent use, "attention required"
const $badgePendingReview: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.palette.accent100,
  borderRadius: radius.full,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  alignSelf: "flex-start",
})
const $labelPendingReview: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.accent500,
})

const $badge: Record<ReportStatus, ThemedStyle<ViewStyle>> = {
  completed: $badgeCompleted,
  in_progress: $badgeInProgress,
  pending_review: $badgePendingReview,
}

const $label: Record<ReportStatus, ThemedStyle<TextStyle>> = {
  completed: $labelCompleted,
  in_progress: $labelInProgress,
  pending_review: $labelPendingReview,
}
