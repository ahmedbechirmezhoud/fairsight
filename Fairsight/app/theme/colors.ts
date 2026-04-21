// FairFleet — editorial monochrome, light mode
// Rule: remove all photography → reads as black-and-cream print layout.
// Color lives in imagery and data viz only. Chrome stays neutral.

const palette = {
  // Warm neutral ramp — cream off-white → near-black
  neutral100: "#FEFCFA", // warm near-white — modals, elevated surfaces
  neutral200: "#F5F0EB", // cream canvas — primary screen background
  neutral300: "#EBE3D8", // card/input surface, subtle separators
  neutral400: "#CEC5BB", // muted border, inactive elements
  neutral500: "#9C9088", // tertiary text, placeholders
  neutral600: "#5C524A", // secondary text
  neutral700: "#3A3330", // supporting copy
  neutral800: "#1A1714", // primary text — warm near-black
  neutral900: "#0F0D0C", // deepest black — CTA background

  // Monochrome "primary" — black pill CTA
  primary100: "#EBE3D8", // CTA disabled background
  primary500: "#0F0D0C", // CTA surface (black pill)
  primary600: "#3A3330", // CTA pressed state

  // Secondary — maps to monochrome for toggles / selected states
  secondary100: "#F5F0EB",
  secondary200: "#EBE3D8",
  secondary300: "#CEC5BB",
  secondary400: "#3A3330",
  secondary500: "#0F0D0C", // active/selected state → black

  // Accent — warm amber, reserved for critical stat emphasis only
  // Never use on UI surfaces, navigation, or text
  accent100: "#F5EDD8",
  accent200: "#EDD9A8",
  accent300: "#D4B86A",
  accent400: "#B89440",
  accent500: "#8C6D20", // anchor — data viz / single critical metric

  angry100: "#F5E6E0",
  angry500: "#C03403",

  overlay20: "rgba(15, 13, 12, 0.2)",
  overlay50: "rgba(15, 13, 12, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",

  // — Text —
  text: palette.neutral800, // primary: headings, body, icons
  textDim: palette.neutral600, // secondary: supporting copy, captions
  textSubtle: palette.neutral500, // tertiary: timestamps, disabled, placeholders
  textInverse: palette.neutral100, // on dark/CTA surfaces

  // — Backgrounds —
  background: palette.neutral200, // canvas: base screen color
  backgroundSurface: palette.neutral300, // cards, inputs — one step above canvas
  backgroundElevated: palette.neutral100, // modals, sheets — two steps above canvas

  // — Interactive —
  tint: palette.primary500, // black pill CTA
  tintInactive: palette.neutral400, // disabled / inactive state

  // — Border / separator —
  border: palette.neutral300, // near-invisible warm grey (prefer whitespace)
  separator: palette.neutral300, // list dividers, section lines

  // — Status —
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
