// FairFleet — editorial monochrome, dark mode
// Canvas: near-black slightly warm. CTAs invert to cream/white pills.
// Brand colors lifted 1-2 steps vs light (saturated colors read heavier on dark).

const palette = {
  // Warm neutral ramp — inverted (darkest first to mirror light keys)
  neutral100: "#0F0D0C", // darkest — used as "dark surface" in reversed components
  neutral200: "#1A1714", // canvas — primary screen background (warm near-black)
  neutral300: "#232018", // card/input surface
  neutral400: "#2E2A24", // subtle border
  neutral500: "#6B6560", // tertiary text
  neutral600: "#9C9088", // secondary text
  neutral700: "#C4BBB0", // supporting copy
  neutral800: "#EDE5DA", // primary text (warm cream)
  neutral900: "#F5F0EB", // brightest — headings, high-emphasis

  // Monochrome "primary" — cream/white pill CTA (inverted from light)
  primary100: "#2E2A24", // CTA disabled background
  primary500: "#F5F0EB", // CTA surface (cream pill — inverted)
  primary600: "#EDE5DA", // CTA pressed state

  // Secondary — maps to monochrome for toggles / selected states
  secondary100: "#1A1714",
  secondary200: "#2E2A24",
  secondary300: "#6B6560",
  secondary400: "#EDE5DA",
  secondary500: "#F5F0EB", // active/selected state → cream/white

  // Accent — lifted 1-2 steps in dark mode
  accent100: "#1A160A",
  accent200: "#2E2510",
  accent300: "#8C6D20",
  accent400: "#B89440",
  accent500: "#D4A93A", // lifted from light's 500

  angry100: "#2A1410",
  angry500: "#E8643A", // slightly lifted for dark bg visibility

  overlay20: "rgba(15, 13, 12, 0.2)",
  overlay50: "rgba(15, 13, 12, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",

  // — Text —
  text: palette.neutral800,
  textDim: palette.neutral600,
  textSubtle: palette.neutral500,
  textInverse: palette.neutral100,

  // — Backgrounds —
  background: palette.neutral200,
  backgroundSurface: palette.neutral300,
  backgroundElevated: palette.neutral400,

  // — Interactive —
  tint: palette.primary500,
  tintInactive: palette.neutral400,

  // — Border / separator —
  border: palette.neutral400,
  separator: palette.neutral300,

  // — Status —
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
