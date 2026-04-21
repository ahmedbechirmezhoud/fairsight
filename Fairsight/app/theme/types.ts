import type { StyleProp } from "react-native"

import { colors as colorsLight } from "./colors"
import { colors as colorsDark } from "./colorsDark"
import { radius } from "./radius"
import { spacing as spacingLight } from "./spacing"
import { spacing as spacingDark } from "./spacingDark"
import { timing } from "./timing"
import { typography } from "./typography"

export type ImmutableThemeContextModeT = "light" | "dark"
export type ThemeContextModeT = ImmutableThemeContextModeT | undefined

export type Colors = typeof colorsLight | typeof colorsDark
export type Spacing = typeof spacingLight | typeof spacingDark
export type Timing = typeof timing
export type Typography = typeof typography
export type Radius = typeof radius

export interface Theme {
  colors: Colors
  spacing: Spacing
  typography: Typography
  timing: Timing
  radius: Radius
  isDark: boolean
}

/**
 * Represents a function that returns a styled component based on the provided theme.
 * @template T The type of the style.
 * @param theme The theme object.
 * @returns The styled component.
 *
 * @example
 * const $container: ThemedStyle<ViewStyle> = ({ colors, spacing, radius }) => ({
 *   flex: 1,
 *   backgroundColor: colors.background,
 *   padding: spacing.md,
 *   borderRadius: radius.lg,
 * })
 * const Component = () => {
 *   const { themed } = useAppTheme()
 *   return <View style={themed($container)} />
 * }
 */
export type ThemedStyle<T> = (theme: Theme) => T
export type ThemedStyleArray<T> = (
  | ThemedStyle<T>
  | StyleProp<T>
  | (StyleProp<T> | ThemedStyle<T>)[]
)[]

export type AllowedStylesT<T> = ThemedStyle<T> | StyleProp<T> | ThemedStyleArray<T>
export type ThemedFnT = <T>(styleOrStyleFn: AllowedStylesT<T>) => T
