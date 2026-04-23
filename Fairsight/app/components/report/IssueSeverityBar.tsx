import { View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { IssueSeverity } from "@/types/api"

interface IssueSeverityBarProps {
  severity: IssueSeverity
}

export function IssueSeverityBar({ severity }: IssueSeverityBarProps) {
  const { themed } = useAppTheme()
  return <View style={themed($bar[severity])} />
}

const $base: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 3,
  borderRadius: 2,
  alignSelf: "stretch",
  marginRight: spacing.sm,
})

const $bar: Record<IssueSeverity, ThemedStyle<ViewStyle>> = {
  critical: (t) => ({ ...$base(t), backgroundColor: t.colors.error }),
  warning: (t) => ({ ...$base(t), backgroundColor: t.colors.palette.accent500 }),
  info: (t) => ({ ...$base(t), backgroundColor: t.colors.border }),
}
