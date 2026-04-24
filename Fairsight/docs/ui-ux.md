# UI / UX: List View, Map View & Native Components

## Philosophy

The goal is to feel like a first-party app on each platform. Rather than building a unified cross-platform design that is mediocre everywhere, the app leans into the idioms and components each platform provides. Platform differences are isolated to small, clearly named files rather than scattered `Platform.OS` checks throughout the codebase.

## Atomic Component Architecture

UI is organised in three layers:

- **Atoms:** single-responsibility display primitives: `StatusBadge`, `TypeBadge`, `IssueSeverityBadge`, `ReportThumbnail`.
- **Molecules:** compositions of atoms that represent a coherent unit of information: `ReportCardHeader`, `WeatherStats`, `DroneStats`, `LocationMap`.
- **Organisms:** full sections or feed-level components that own layout and interaction: `ReportListFeed`, `ReportCard`, `IssuesList`, `ImagesGallery`.

Screens are kept as thin coordinators. They own query state, navigation callbacks, and screen-level layout, but delegate all rendering to organisms. This makes each layer independently testable and prevents screen files from growing into monoliths.

## Search

Search follows each platform's native convention rather than imposing a single cross-platform pattern.

On **iOS**, search is a dedicated tab in the bottom tab bar, rendered with a system search icon (`tabBarSystemItem: "search"`). The tab bar hides while the search screen is active so the full viewport is available for results. The search input is a floating bar anchored just above the keyboard, tracked frame-by-frame with `react-native-keyboard-controller` so it moves in sync with the keyboard animation without any jump. This matches the pattern users know from the App Store, Maps, and other first-party iOS apps.

On **Android**, a search bar sits inline at the top of the report list screen, directly below the navigation header. There is no separate search tab; the bottom navigation only contains the tabs that make sense on that platform. The inline placement follows Material Design conventions where filtering controls live at the top of the content area.

The search tab route is conditionally excluded from the navigator on Android entirely, not just hidden with a style override, so it does not exist in the navigation state at all on that platform.

Both implementations share the same query logic: the search term is passed as a parameter to the reports API, trimmed before dispatch, and the result is cached per term via React Query.

## List View

The reports list uses a `FlatList` with a `RefreshControl` wired to `isFetching`. Skeleton loaders mirror the exact dimensions of the real cards, so the layout does not shift when data arrives. An empty state component handles three distinct cases: loading (skeleton), no data (no inspections yet), and no search results (contextual message including the search term).

## Map View

The map screen clusters report markers so the view is readable at any zoom level. Tapping a cluster opens a bottom sheet listing the reports at that location. The sheet uses detents (`0.5` and `1.0`) so users can preview results with a partial sheet and expand for full detail, a pattern familiar from Apple Maps and Google Maps.

## Native Components

### Liquid Glass (iOS 26+)

The search bar on iOS uses `@callstack/liquid-glass` for the input pill and close button. On devices that support it (`isLiquidGlassSupported`), the two adjacent surfaces merge their edges using the native liquid glass material. On older iOS and Android the components fall back to opaque `backgroundSurface`-coloured views; the layout and behaviour are identical, only the visual treatment differs.

### Tab Bar (iOS)

Navigation uses `react-native-bottom-tabs` which maps directly to `UITabBarController` on iOS. This gives the tab bar the correct blur, haptic feedback, and badge behaviour without any custom implementation. The search tab is hidden on Android because inline search replaces it; the tab is omitted from the navigator entirely on that platform rather than being hidden with a style override, ensuring the route does not exist in the navigation state at all.

### Header Blur (iOS)

The report detail screen header is transparent on iOS with `headerBlurEffect: "systemUltraThinMaterial"`, allowing the hero thumbnail to scroll beneath it. On Android the header receives a solid `colors.background` fill. The `headerStatusBarHeight` is set explicitly on Android using `StatusBar.currentHeight` because the edge-to-edge mode can prevent the safe area inset from reaching the native stack header automatically.

## Theming

All styles are written as functions that receive `{ colors, spacing, typography, radius }` tokens from the theme context. No colour value or spacing constant is ever hardcoded in a component file. The theme supports light, dark, and system modes; the preference is persisted to MMKV so it survives app restarts. Colour contrast ratios meet WCAG 2.2 SC 1.4.3 (4.5:1 minimum) across both light and dark palettes.

## Accessibility

Every interactive element carries `accessibilityRole`, `accessibilityLabel`, and where relevant `accessibilityHint` and `accessibilityState`. List components carry `accessibilityRole="list"`. Assistant chat messages use `accessibilityLiveRegion="polite"` so screen readers announce incoming tokens without interrupting the user.
