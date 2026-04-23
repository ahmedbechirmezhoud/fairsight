import { RefObject } from "react"
import {
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  Pressable,
  TextStyle,
  ViewStyle,
} from "react-native"
import {
  isLiquidGlassSupported,
  LiquidGlassContainerView,
  LiquidGlassView,
} from "@callstack/liquid-glass"
import Animated, { SlideInDown } from "react-native-reanimated"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface SearchBarProps {
  inputRef: RefObject<TextInput | null>
  value: string
  onChangeText: (text: string) => void
  onClose: () => void
  bottomInset: number
}

export function SearchBar({ inputRef, value, onChangeText, onClose, bottomInset }: SearchBarProps) {
  const { themed, theme } = useAppTheme()

  const $bottomPad: ViewStyle = { paddingBottom: bottomInset + 10 }

  return (
    <Animated.View
      entering={SlideInDown.duration(280).springify().damping(20).stiffness(200)}
      style={[themed($bar), $bottomPad, isLiquidGlassSupported && $barGlass]}
    >
      {/*
        LiquidGlassContainerView merges the two adjacent glass elements so their
        edges dissolve into each other — input pill + X button read as one surface.
        On older iOS / Android it falls back to two plain Views.
      */}
      <LiquidGlassContainerView spacing={8} style={$row}>
        {/* Input pill */}
        <LiquidGlassView
          effect="regular"
          style={[
            $inputPill,
            !isLiquidGlassSupported && { backgroundColor: theme.colors.backgroundSurface },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder="Search reports…"
            placeholderTextColor={theme.colors.textDim}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            style={themed($input)}
          />
        </LiquidGlassView>

        {/* X button */}
        <LiquidGlassView
          effect="regular"
          interactive
          style={[
            $closeGlass,
            !isLiquidGlassSupported && { backgroundColor: theme.colors.backgroundSurface },
          ]}
        >
          <Pressable
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close search"
            style={$closePressable}
          >
            <Text style={themed($closeIcon)}>✕</Text>
          </Pressable>
        </LiquidGlassView>
      </LiquidGlassContainerView>
    </Animated.View>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const $bar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopWidth: 1,
  borderTopColor: colors.border,
  paddingTop: spacing.sm,
  paddingHorizontal: spacing.md,
})

const $barGlass: ViewStyle = {
  backgroundColor: "transparent",
  borderTopWidth: 0,
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $inputPill: ViewStyle = {
  flex: 1,
  height: 50,
  borderRadius: 9999,
  justifyContent: "center",
  overflow: "hidden",
}

const $input: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  color: colors.text,
  fontSize: 17,
  fontFamily: typography.primary.normal,
  height: 50,
  paddingHorizontal: 14,
  paddingVertical: 0,
})

const $closeGlass: ViewStyle = {
  width: 50,
  height: 50,
  borderRadius: 9999,
  alignItems: "center",
  justifyContent: "center",
}

const $closePressable: ViewStyle = {
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
}

const $closeIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 17,
  fontWeight: "600",
  lineHeight: 22,
})
