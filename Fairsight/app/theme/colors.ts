// FairFleet — pure grayscale, light mode
// No warm undertones. Color lives in imagery only. Chrome is strictly neutral.

const palette = {
  // Neutral ramp — pure white → pure black
  neutral100: "#FFFFFF", // pure white — modals, elevated surfaces
  neutral200: "#F5F5F5", // canvas — primary screen background
  neutral300: "#E8E8E8", // card/input surface, separators
  neutral400: "#CCCCCC", // muted border, inactive elements
  neutral500: "#999999", // tertiary text, placeholders
  neutral600: "#666666", // secondary text
  neutral700: "#444444", // supporting copy
  neutral800: "#1A1A1A", // primary text
  neutral900: "#000000", // deepest black — CTA background

  // Monochrome "primary" — black pill CTA
  primary100: "#E8E8E8", // CTA disabled background
  primary500: "#000000", // CTA surface (black pill)
  primary600: "#333333", // CTA pressed state

  // Secondary — grayscale for toggles / selected states
  secondary100: "#F5F5F5",
  secondary200: "#E8E8E8",
  secondary300: "#CCCCCC",
  secondary400: "#444444",
  secondary500: "#000000", // active/selected state

  // Accent — replaced with neutral gray (no color emphasis)
  accent100: "#F0F0F0",
  accent200: "#E0E0E0",
  accent300: "#AAAAAA",
  accent400: "#777777",
  accent500: "#555555",

  angry100: "#F5E6E0",
  angry500: "#C03403",

  overlay20: "rgba(0, 0, 0, 0.2)",
  overlay50: "rgba(0, 0, 0, 0.5)",
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
  backgroundElevated: palette.neutral100,

  // — Interactive —
  tint: palette.primary500,
  tintInactive: palette.neutral400,

  // — Border / separator —
  border: palette.neutral300,
  separator: palette.neutral300,

  // — Status —
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
