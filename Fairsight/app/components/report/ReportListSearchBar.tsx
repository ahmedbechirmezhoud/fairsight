import {
  Pressable,
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ReportListSearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export function ReportListSearchBar({ value, onChangeText }: ReportListSearchBarProps) {
  const { themed, theme } = useAppTheme()

  return (
    <View style={themed($row)}>
      <View style={themed($pill)}>
        <Ionicons name="search" size={16} color={theme.colors.textDim} style={$icon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search by title or location…"
          placeholderTextColor={theme.colors.textDim}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          style={themed($input)}
          accessibilityLabel="Search reports"
          accessibilityHint="Type a report title or location"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => onChangeText("")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={16} color={theme.colors.textDim} />
          </Pressable>
        )}
      </View>
    </View>
  )
}

const $row: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
})

const $pill: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.full,
  paddingHorizontal: 12,
  height: 40,
})

const $icon: ViewStyle = { marginRight: 8 }

const $input: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  color: colors.text,
  fontSize: 15,
  fontFamily: typography.primary.normal,
  paddingVertical: 0,
})
