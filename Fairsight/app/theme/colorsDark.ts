// FairFleet — pure grayscale, dark mode
// Canvas: pure near-black. CTAs invert to white pills.

const palette = {
  // Neutral ramp — inverted (darkest first to mirror light keys)
  neutral100: "#000000", // darkest — deep surfaces
  neutral200: "#111111", // canvas — primary screen background
  neutral300: "#1E1E1E", // card/input surface
  neutral400: "#2A2A2A", // subtle border
  neutral500: "#666666", // tertiary text
  neutral600: "#999999", // secondary text
  neutral700: "#BBBBBB", // supporting copy
  neutral800: "#E8E8E8", // primary text
  neutral900: "#F5F5F5", // high-emphasis headings

  // Monochrome "primary" — white pill CTA (inverted from light)
  primary100: "#2A2A2A", // CTA disabled background
  primary500: "#F5F5F5", // CTA surface (white pill)
  primary600: "#E0E0E0", // CTA pressed state

  // Secondary — grayscale for toggles / selected states
  secondary100: "#111111",
  secondary200: "#2A2A2A",
  secondary300: "#666666",
  secondary400: "#E0E0E0",
  secondary500: "#F5F5F5", // active/selected state

  // Accent — neutral gray (no color emphasis)
  accent100: "#1A1A1A",
  accent200: "#2A2A2A",
  accent300: "#555555",
  accent400: "#777777",
  accent500: "#AAAAAA",

  angry100: "#2A1410",
  angry500: "#E8643A",

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
