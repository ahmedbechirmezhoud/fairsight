import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface SectionHeaderProps {
  title: string
  count?: number
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  const { themed } = useAppTheme()

  return (
    <View style={$row}>
      <Text size="xxs" weight="semiBold" style={themed($title)}>
        {title.toUpperCase()}
      </Text>
      {count !== undefined && (
        <View style={themed($countBadge)}>
          <Text size="xxs" weight="medium" style={themed($countText)}>
            {count}
          </Text>
        </View>
      )}
    </View>
  )
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  letterSpacing: 0.8,
})

const $countBadge: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.full,
  paddingHorizontal: spacing.xxs,
  paddingVertical: 2,
})

const $countText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
