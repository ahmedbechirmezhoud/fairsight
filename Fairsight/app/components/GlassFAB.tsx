import { Platform, Pressable, ViewStyle } from "react-native"
import { isLiquidGlassSupported, LiquidGlassView } from "@callstack/liquid-glass"
import { MaterialSymbol, MaterialSymbolProps, SFSymbol } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import type { SFSymbol as SFSymbolName } from "sf-symbols-typescript"

import { useAppTheme } from "@/theme/context"

interface GlassFABProps {
  onPress: () => void
  accessibilityLabel: string
  icon?: { sf: string; material: string }
  bottomOffset?: number
}

const FAB_SIZE = 56

/**
 * Floating action button — two tiers:
 *   iOS 26+ (liquid glass supported) → LiquidGlassView
 *   Everything else → solid tint button
 */
const DEFAULT_ICON = { sf: "message.fill", material: "chat" }

export function GlassFAB({
  onPress,
  accessibilityLabel,
  bottomOffset = 0,
  icon = DEFAULT_ICON,
}: GlassFABProps) {
  const { theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const $position: ViewStyle = {
    position: "absolute",
    bottom: insets.bottom + theme.spacing.xxxl + bottomOffset,
    right: theme.spacing.md,
  }

  const iconColor = isLiquidGlassSupported ? theme.colors.text : theme.colors.textInverse

  const iconEl =
    Platform.OS === "ios" ? (
      <SFSymbol
        name={icon.sf as SFSymbolName}
        color={iconColor}
        weight="medium"
        style={$iconSize}
      />
    ) : (
      <MaterialSymbol
        name={icon.material as MaterialSymbolProps["name"]}
        color={iconColor}
        style={$iconSize}
      />
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
          {iconEl}
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
      {iconEl}
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
