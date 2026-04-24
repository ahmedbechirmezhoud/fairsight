# Map Strategy: Mapbox (Android) & Apple Maps (iOS)

## The Problem

`react-native-maps` works well on iOS using Apple Maps as its default provider. On Android it delegates to Google Maps, which requires a valid API key provisioned through the Google Cloud Console. Without that key the map silently fails or crashes at startup, a fragile dependency for a technical test where the evaluator may not have the key configured.

## Decision

Rather than requiring a Google Maps API key, Android uses Mapbox as a drop-in replacement. The platforms share the same public API (`ReportsMapView`, `LocationMap`) and the same navigation behaviour. The difference is entirely internal and resolved by Metro's platform-specific file extension mechanism: `.ios.tsx` and `.android.tsx` files are selected automatically at bundle time with no conditional logic in the consuming code.

## iOS: Apple Maps via react-native-maps

On iOS, `react-native-maps` renders a native `MKMapView`. No API key is required. The map supports dark mode through `userInterfaceStyle` and a custom `customMapStyle` array that mirrors the app's dark colour palette for Google Maps elements (used only on Android/Google provider, included for completeness). Clustering is provided by `react-native-map-clustering`, which wraps the map view and handles the supercluster algorithm on the JS thread.

## Android: Mapbox GL

Mapbox GL renders on the GPU via OpenGL, making it performant even with many markers. Clustering is handled natively inside `ShapeSource` by setting `cluster={true}`; no third-party clustering library is needed. The cluster radius, maximum zoom, and visual style (circle radius stepped by count, count label) are configured in the layer styles passed to `CircleLayer` and `SymbolLayer`.

Marker interaction works through a single `onPress` handler on the `ShapeSource`. When the pressed feature carries a `cluster` property the handler calls `getClusterLeaves()` on the `ShapeSource` ref to retrieve the individual report IDs, then opens the same `MapReportSheet` navigation route that iOS uses. Individual markers resolve directly to their report ID. The sheet and all downstream behaviour are platform-agnostic.

## Token Setup

Mapbox requires two tokens:

- **Download token** (`RNMAPBOX_MAPS_DOWNLOAD_TOKEN`): used at Android build time to authenticate the Maven repository download of the Mapbox SDK. Not required in Maps SDK v11 for most configurations, but set it if the build fails.
- **Public access token** (`EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`): used at runtime to authenticate tile requests. It must be written to the Android native string resources (`mapbox_access_token`) before the native `MapView` constructor runs, which happens before the JS bridge is available. A custom Expo config plugin in `app.config.ts` handles this at prebuild time using `withStringsXml`.

## Dark Mode

Both implementations adapt to the app's theme context. On iOS, `userInterfaceStyle` flips the Apple Maps appearance. On Android, the `styleURL` prop switches between `mapbox://styles/mapbox/streets-v12` (light) and `mapbox://styles/mapbox/dark-v11` (dark). Marker and cluster colours are read from the theme token system so they always contrast correctly against the current map style.

## Static Detail Map

The report detail screen shows a small non-interactive map centred on the inspection coordinates. On Android, interaction gestures are disabled via `scrollEnabled`, `pitchEnabled`, `rotateEnabled`, and `zoomEnabled`. The marker is rendered as a `ShapeSource` + `CircleLayer` rather than a `PointAnnotation`: `PointAnnotation` rasterises its children to a bitmap that Android can recycle mid-draw, causing a hard crash. The `CircleLayer` approach renders entirely on the GL thread and has no bitmap lifecycle.
