import { Platform, Pressable, ViewStyle } from "react-native"
import { isLiquidGlassSupported, LiquidGlassView } from "@callstack/liquid-glass"
import { MaterialSymbol, SFSymbol } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppTheme } from "@/theme/context"

interface GlassFABProps {
  onPress: () => void
  accessibilityLabel: string
}

const FAB_SIZE = 56

/**
 * Floating action button — two tiers:
 *   iOS 26+ (liquid glass supported) → LiquidGlassView
 *   Everything else → solid tint button
 */
export function GlassFAB({ onPress, accessibilityLabel }: GlassFABProps) {
  const { theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const $position: ViewStyle = {
    position: "absolute",
    bottom: insets.bottom + theme.spacing.md,
    right: theme.spacing.md,
  }

  const iconColor = isLiquidGlassSupported ? theme.colors.text : theme.colors.textInverse

  const icon =
    Platform.OS === "ios" ? (
      <SFSymbol name="message.fill" color={iconColor} weight="medium" style={$iconSize} />
    ) : (
      <MaterialSymbol name="chat" color={iconColor} style={$iconSize} />
    )

  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView effect="regular" interactive style={[$position, $fab]}>
        <Pressable
          onPress={onPress}
          style={$pressable}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          hitSlop={8}
        >
          {icon}
        </Pressable>
      </LiquidGlassView>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      style={[$position, $fab, { backgroundColor: theme.colors.tint }]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      android_ripple={{
        color: theme.colors.palette.neutral600,
        borderless: false,
        radius: FAB_SIZE / 2,
      }}
    >
      {icon}
    </Pressable>
  )
}

const $fab: ViewStyle = {
  width: FAB_SIZE,
  height: FAB_SIZE,
  borderRadius: FAB_SIZE / 2,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 8,
  elevation: 6,
}

const $pressable: ViewStyle = {
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
}

const $iconSize = { width: 24, height: 24 }
