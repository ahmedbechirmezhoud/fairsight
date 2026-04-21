import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { InspectionType } from "@/types/api"

const TYPE_LABEL: Record<InspectionType, string> = {
  facade: "Facade",
  rooftop: "Rooftop",
}

interface TypeBadgeProps {
  type: InspectionType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($badge)}>
      <Text size="xxs" weight="medium" style={themed($label)}>
        {TYPE_LABEL[type]}
      </Text>
    </View>
  )
}

const $badge: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  borderRadius: radius.full,
  borderWidth: 1,
  borderColor: colors.border,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  alignSelf: "flex-start",
})

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
