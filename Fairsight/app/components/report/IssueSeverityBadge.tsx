import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { IssueSeverity } from "@/types/api"

import { SEVERITY_LABEL } from "./issueConstants"

interface IssueSeverityBadgeProps {
  severity: IssueSeverity
}

export function IssueSeverityBadge({ severity }: IssueSeverityBadgeProps) {
  const { themed } = useAppTheme()
  return (
    <View
      style={themed($badge[severity])}
      accessible={true}
      accessibilityLabel={`Severity: ${SEVERITY_LABEL[severity]}`}
    >
      <Text size="xxs" weight="semiBold" style={themed($label[severity])}>
        {SEVERITY_LABEL[severity]}
      </Text>
    </View>
  )
}

const $badgeBase: ThemedStyle<ViewStyle> = ({ radius, spacing }) => ({
  borderRadius: radius.full,
  paddingHorizontal: spacing.xxs,
  paddingVertical: 2,
  alignSelf: "flex-start",
})

const $badge: Record<IssueSeverity, ThemedStyle<ViewStyle>> = {
  critical: (t) => ({ ...$badgeBase(t), backgroundColor: t.colors.errorBackground }),
  warning: (t) => ({ ...$badgeBase(t), backgroundColor: t.colors.palette.accent100 }),
  info: (t) => ({ ...$badgeBase(t), backgroundColor: t.colors.backgroundSurface }),
}

const $label: Record<IssueSeverity, ThemedStyle<TextStyle>> = {
  critical: ({ colors }) => ({ color: colors.error }),
  warning: ({ colors }) => ({ color: colors.palette.accent500 }),
  info: ({ colors }) => ({ color: colors.textSubtle }),
}
