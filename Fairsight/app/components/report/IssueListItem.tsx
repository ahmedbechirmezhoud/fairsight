import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { Issue, IssueSeverity } from "@/types/api"

const SEVERITY_LABEL: Record<IssueSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
}

const CATEGORY_LABEL: Record<Issue["category"], string> = {
  missing_object: "Missing object",
  soiling: "Soiling",
  damage: "Damage",
}

interface IssueListItemProps {
  issue: Issue
}

export function IssueListItem({ issue }: IssueListItemProps) {
  const { themed } = useAppTheme()

  return (
    <View
      style={themed($container)}
      accessibilityRole="text"
      accessibilityLabel={`${SEVERITY_LABEL[issue.severity]} issue: ${issue.description}`}
    >
      {/* Severity indicator bar */}
      <View style={themed($severityBar[issue.severity])} />

      <View style={$content}>
        {/* Top row: severity + category */}
        <View style={$metaRow}>
          <View style={themed($severityBadge[issue.severity])}>
            <Text size="xxs" weight="semiBold" style={themed($severityLabel[issue.severity])}>
              {SEVERITY_LABEL[issue.severity]}
            </Text>
          </View>
          <Text size="xxs" style={themed($category)}>
            {CATEGORY_LABEL[issue.category]}
          </Text>
        </View>

        {/* Description */}
        <Text size="xs" style={themed($description)}>
          {issue.description}
        </Text>

        {/* Location */}
        <Text size="xxs" style={themed($location)}>
          {issue.location_on_site}
        </Text>
      </View>
    </View>
  )
}

// — Severity bar (left accent strip) —
const $severityBarBase: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 3,
  borderRadius: 2,
  alignSelf: "stretch",
  marginRight: spacing.sm,
})
const $severityBarCritical: ThemedStyle<ViewStyle> = (theme) => ({
  ...$severityBarBase(theme),
  backgroundColor: theme.colors.error,
})
const $severityBarWarning: ThemedStyle<ViewStyle> = (theme) => ({
  ...$severityBarBase(theme),
  backgroundColor: theme.colors.palette.accent500,
})
const $severityBarInfo: ThemedStyle<ViewStyle> = (theme) => ({
  ...$severityBarBase(theme),
  backgroundColor: theme.colors.border,
})
const $severityBar: Record<IssueSeverity, ThemedStyle<ViewStyle>> = {
  critical: $severityBarCritical,
  warning: $severityBarWarning,
  info: $severityBarInfo,
}

// — Severity badge —
const $severityBadgeBase: ThemedStyle<ViewStyle> = ({ radius, spacing }) => ({
  borderRadius: radius.full,
  paddingHorizontal: spacing.xxs,
  paddingVertical: 2,
  alignSelf: "flex-start",
})
const $severityBadgeCritical: ThemedStyle<ViewStyle> = (theme) => ({
  ...$severityBadgeBase(theme),
  backgroundColor: theme.colors.errorBackground,
})
const $severityBadgeWarning: ThemedStyle<ViewStyle> = (theme) => ({
  ...$severityBadgeBase(theme),
  backgroundColor: theme.colors.palette.accent100,
})
const $severityBadgeInfo: ThemedStyle<ViewStyle> = (theme) => ({
  ...$severityBadgeBase(theme),
  backgroundColor: theme.colors.backgroundSurface,
})
const $severityBadge: Record<IssueSeverity, ThemedStyle<ViewStyle>> = {
  critical: $severityBadgeCritical,
  warning: $severityBadgeWarning,
  info: $severityBadgeInfo,
}

// — Severity label text —
const $severityLabelCritical: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})
const $severityLabelWarning: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.accent500,
})
const $severityLabelInfo: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
const $severityLabel: Record<IssueSeverity, ThemedStyle<TextStyle>> = {
  critical: $severityLabelCritical,
  warning: $severityLabelWarning,
  info: $severityLabelInfo,
}

// — Layout —
const $container: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  flexDirection: "row",
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.md,
  padding: spacing.sm,
  overflow: "hidden",
})

const $content: ViewStyle = {
  flex: 1,
  gap: 4,
}

const $metaRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $category: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})

const $description: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $location: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  fontStyle: "italic",
})
