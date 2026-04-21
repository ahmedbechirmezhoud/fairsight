/**
 * FairFleet motion timing.
 * Motion communicates state change — never decorative.
 * Always respect reduced-motion: replace motion with instant/fade.
 */
export const timing = {
  /** Tap state changes, immediate feedback — 100ms */
  instant: 100,
  /** Micro-interactions, toggles — 200ms */
  fast: 200,
  /** Entering/exiting elements — 300ms */
  default: 300,
  /** Page transitions, large surfaces — 450ms */
  slow: 450,

  // Legacy alias — keep for existing usage
  quick: 300,
} as const
