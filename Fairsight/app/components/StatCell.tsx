import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface StatCellProps {
  label: string
  value: string | number
  unit?: string
}

export function StatCell({ label, value, unit }: StatCellProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($cell)}>
      <Text size="xxs" style={themed($label)}>
        {label}
      </Text>
      <View style={$valueRow}>
        <Text size="sm" weight="semiBold" style={themed($value)}>
          {value}
        </Text>
        {unit !== undefined && (
          <Text size="xxs" style={themed($unit)}>
            {" "}
            {unit}
          </Text>
        )}
      </View>
    </View>
  )
}

const $cell: ThemedStyle<ViewStyle> = ({ colors, spacing, radius }) => ({
  flex: 1,
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.md,
  padding: spacing.sm,
  gap: 4,
})

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})

const $valueRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "baseline",
}

const $value: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $unit: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
