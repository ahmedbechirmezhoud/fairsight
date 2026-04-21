---
name: app-design-system
description: Design-system rules for modern consumer mobile apps — semantic color tokens (light + dark, themeable), type scale, spacing, radius, elevation, motion, states, accessibility, and onboarding patterns. Use this skill whenever the user is designing, building, reviewing, or restyling a consumer-facing app screen, component, onboarding flow, button, card, nav, theme, or color palette — including gamified, sports, loyalty, and social apps. Also use it when the user mentions dark mode, theming, design tokens, color accessibility, tap targets, or asks for UI critique on a consumer app, even if they don't explicitly say "design system."
---

# Consumer App Design System

Opinionated ruleset for modern consumer mobile apps. Mobile-first, accessible by default, restrained by default, themeable at the right layer.

## Core principles (the non-negotiables)

1. **Mobile-first.** Design the smallest screen first, primary actions in the reachable lower third.
2. **Scan, don't read.** Users scan. Hierarchy through size, weight, contrast, and space — not decoration.
3. **Remove what doesn't help the user act.** Restraint beats maximalism. Calmer screens perform better.
4. **Platform conventions win over cleverness.** Bottom tabs for primary nav (4–5 items max), native gestures, respected safe areas.
5. **Accessibility is baseline, not a toggle.** WCAG AA from day one.
6. **Dark mode is first-class, not a port.** Every color decision has a dark-mode pair.
7. **Every tap gets feedback.** Visual + haptic. No silent actions.
8. **Never a blank screen.** Every screen has loading, empty, and error states.

---

## Color system

This is the most mis-designed part of most apps. Do it in three tiers.

### Tier 1 — Primitive tokens (the raw palette)

Numbered scales, never used directly in components. These just exist.

```
neutral/50  → neutral/900     (11 steps, near-white to near-black)
brand/50    → brand/900       (your one brand hue)
success/50  → success/900
warning/50  → warning/900
error/50    → error/900
info/50     → info/900
```

Rules for building primitive ramps:
- Use an **11-step scale** (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, plus 950 if needed).
- 500 is the "anchor" of each ramp — the one you'd print on a t-shirt.
- 50–200 for backgrounds, 300–500 for borders/subtle fills, 500–700 for text and interactive, 800–900 for headings and high-emphasis text.
- Pick a **single brand hue**. Consumer apps rarely need two primary brand colors — it weakens identity.

### Tier 2 — Semantic tokens (the ones you actually use)

Every interface element has exactly three color properties: **background, foreground, border**. Name tokens by role, not by color.

**Backgrounds**
```
bg/canvas         — the base screen color
bg/surface        — cards, sheets, inputs (one step raised from canvas)
bg/elevated       — modals, popovers (two steps raised)
bg/overlay        — scrim behind modals (black at ~40% alpha)
```

**Foreground (text + icons)**
```
text/primary      — headings, main body, icons on neutral bg
text/secondary    — supporting copy, captions
text/tertiary     — timestamps, disabled text, least-important
text/inverse      — text on dark/colored surfaces in light mode
text/on-accent    — text placed on the brand color (must pass contrast on brand/500+)
```

**Border**
```
border/subtle     — default card/input borders, near-invisible
border/default    — visible dividers
border/strong     — emphasized containers
border/focus      — keyboard focus ring, always brand color
```

**Interactive (buttons, links, toggles)**
```
interactive/primary              — main CTA surface (usually brand/500 or brand/600)
interactive/primary-pressed      — one step darker
interactive/primary-disabled     — neutral/200 bg + text/tertiary
interactive/secondary            — outline or ghost variant
```

**Status** — each has `-bg`, `-fg`, and `-border` subtokens
```
status/success/*  — confirmations, completed states
status/warning/*  — caution, non-blocking issues
status/error/*    — destructive actions, validation failures
status/info/*     — neutral informational
```

**Accent / theme slot**
```
accent/brand           — hero moments, selected states, key highlights
accent/brand-subtle    — tinted backgrounds for accent surfaces
```

### Tier 3 — Component tokens (optional)

Only for large systems. Name as `component-part-state`: `button-primary-bg-pressed`. Most apps don't need this layer — skip until the system hurts without it.

### Light + dark pairing

Every semantic token **must** define both light and dark values. Example:

```
bg/canvas         light: neutral/50     dark: neutral/950
bg/surface        light: white          dark: neutral/900
text/primary      light: neutral/900    dark: neutral/50
text/secondary    light: neutral/600    dark: neutral/400
border/subtle     light: neutral/200    dark: neutral/800
interactive/primary  light: brand/600   dark: brand/400
```

Rule: in dark mode, **lift** brand colors one or two steps (brand/600 becomes brand/400) because saturated colors look heavier on dark backgrounds.

### Theming slot (for club-adaptive / multi-brand apps)

When different users should see different brand colors (e.g. ILCapo clubs):

- Keep **all neutrals, status, text, borders, and backgrounds stable** across themes. Never let them shift.
- Only `accent/brand`, `accent/brand-subtle`, `interactive/primary`, and `border/focus` re-map per theme.
- Always validate the theme color against text/on-accent contrast before allowing it (4.5:1 for normal text, 3:1 for large). If a club color fails, pair it with a darker/lighter variant automatically.

### Accessibility rules (non-negotiable)

- **Text:** 4.5:1 contrast minimum (WCAG AA). Large text (18pt+ or 14pt+ bold): 3:1.
- **UI components and graphical indicators:** 3:1 against adjacent colors.
- **Focus indicator:** always visible, never `outline: none` without replacement, always `border/focus`.
- **Never rely on color alone** to convey meaning — always pair with icon, text, or shape. Red error + ⚠ icon + message, not just red border.

---

## Typography

One type family for UI. Use a clean sans-serif (system fonts are fine: SF Pro / Roboto / Inter).

Scale (mobile):
```
display   32/40, 700       — hero moments only
h1        24/32, 700       — screen titles
h2        20/28, 600       — section titles
h3        17/24, 600       — card titles
body      15/22, 400       — default body
body-sm   13/18, 400       — captions, metadata
caption   11/16, 500, +1%  — labels, badges (often ALL CAPS with tracking)
```

- Line-height generous (1.4–1.5 for body).
- Body text **never below 14pt** on mobile.
- Support Dynamic Type / font scaling — no hard-coded pixel sizes for readable text.

---

## Spacing & layout

- **4pt grid** base unit. All spacing is a multiple of 4.
- T-shirt scale: `xs: 4, sm: 8, md: 12, lg: 16, xl: 24, 2xl: 32, 3xl: 48, 4xl: 64`.
- **Touch targets: minimum 44×44pt (iOS) / 48×48dp (Android).** Always. Shrinking this kills accessibility and fat-finger-proofs nothing.
- Primary actions live in the **bottom third** of the screen (thumb zone).
- Respect safe areas (notch, home indicator, dynamic island).
- Bottom navigation: 4–5 items maximum. More = hamburger or secondary menu.

---

## Radius

```
radius/xs    4   — tags, small chips
radius/sm    8   — inputs, small buttons
radius/md    12  — default buttons, small cards
radius/lg    16  — cards, sheets
radius/xl    24  — large surfaces, modals
radius/full  999 — pills, avatars, badges
```

Pick one radius personality and hold it. Mixing sharp 4s with pillowy 24s reads as inconsistent.

---

## Elevation

Prefer contrast over shadow. Shadows are for clear depth signals only.

```
elevation/0   — flat, on canvas
elevation/1   — cards, subtle lift (y:1, blur:2, alpha:0.04)
elevation/2   — floating elements, FAB (y:4, blur:8, alpha:0.08)
elevation/3   — modals, menus (y:8, blur:24, alpha:0.12)
```

In dark mode, use **lighter surface colors** instead of shadows — shadows disappear on black.

---

## Motion

```
duration/instant   100ms   — tap state change
duration/fast      200ms   — micro-interactions, toggles
duration/default   300ms   — entering/exiting elements
duration/slow      450ms   — page transitions, large surfaces
```

- **Ease-out** for entering (natural, welcoming).
- **Ease-in** for exiting (quick dismissal).
- **Ease-in-out** for repositioning.
- Always respect `prefers-reduced-motion` — replace motion with fades or instant.
- Motion communicates state change. Never decorative.

---

## States (every interactive element has all of these)

`default → hovered → pressed → focused → disabled → loading → error`

- Ship none of these as an afterthought. Design the pressed state the same day as the default.
- Loading ≠ spinner-on-nothing. Use skeleton screens for content, inline spinners for actions.
- Empty state ≠ blank. Always include illustration/icon + one-line explanation + one action.

---

## Feedback & micro-interactions

- Every tap: visual response within 100ms + haptic on iOS (`.light` for taps, `.success` for confirmations).
- System status always visible — never leave the user guessing if something's loading.
- Errors: **inline**, near the field, constructive ("Phone needs country code") — not modal alerts.
- Success: fleeting toast, auto-dismiss in 2–3s, never require acknowledgement.

---

## Common failures to catch

- Hard-coded hex values in components → move to semantic tokens.
- Dark mode "ported" by inverting light mode → rebuild with dark-mode contrast logic, lift brand colors.
- Touch targets below 44pt → enlarge the hit area even if the visual stays small.
- Error states shown only via red color → add icon + text.
- Five different corner radii across the app → pick one personality and hold it.
- Onboarding with sign-up wall on screen one → move it after first value moment.
- Loading spinners on blank screens → replace with skeletons.
- Theme color applied to text/bg/borders everywhere → restrict theming to accent slot only.
- Primary CTA at the top of the screen → move to bottom third.
- Motion on every element → reserve motion for state changes, strip decoration.
