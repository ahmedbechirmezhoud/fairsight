import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface DetailRowProps {
  label: string
  value: string
  multiline?: boolean
}

export function DetailRow({ label, value, multiline = false }: DetailRowProps) {
  const { themed } = useAppTheme()

  return (
    <View style={[themed($row), multiline && $multilineRow]}>
      <Text size="xs" style={themed($label)}>
        {label}
      </Text>
      <Text
        size="xs"
        style={themed($value)}
        numberOfLines={multiline ? undefined : 1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  )
}

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  paddingVertical: spacing.xs,
  gap: spacing.md,
})

const $multilineRow: ViewStyle = {
  flexDirection: "column",
  gap: 4,
}

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  minWidth: 88,
  flexShrink: 0,
})

const $value: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  flex: 1,
})
