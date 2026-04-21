/**
 * FairFleet border radius scale.
 * Pick one personality and hold it — editorial = slightly rounded, not pillowy.
 * md (12) is the default. Use full (999) for pills/badges only.
 */
export const radius = {
  xs: 4, // tags, small chips
  sm: 8, // inputs, small buttons
  md: 12, // default buttons, small cards
  lg: 16, // cards, sheets
  xl: 24, // large surfaces, bottom sheets
  full: 999, // pills, avatars, status badges
} as const
