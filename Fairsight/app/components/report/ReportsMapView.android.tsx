/**
 * Android-only map using Mapbox GL (react-native-maps does not work on Android
 * without a Google Maps API key; Mapbox is the fallback).
 *
 * Runtime token: set EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file.
 * Build-time (Maven) token: set RNMAPBOX_MAPS_DOWNLOAD_TOKEN in your .env file.
 */
import { useCallback, useMemo, useRef } from "react"
import { ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import MapboxGL, { Camera, CircleLayer, MapView, ShapeSource, SymbolLayer } from "@rnmapbox/maps"

import { useAppTheme } from "@/theme/context"
import type { ReportSummary } from "@/types/api"
import { MAPBOX_STYLE_DARK, MAPBOX_STYLE_LIGHT } from "@/utils/mapboxStyles"

// Set once at module load. Token is inlined at build time by Metro via EXPO_PUBLIC_ prefix.
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "")

interface ReportsMapViewProps {
  reports: ReportSummary[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

type BoundsCamera = {
  type: "bounds"
  ne: [number, number]
  sw: [number, number]
  padding: number
}
type CenterCamera = { type: "center"; center: [number, number]; zoom: number }
type CameraConfig = BoundsCamera | CenterCamera

function computeCamera(reports: ReportSummary[]): CameraConfig {
  if (reports.length === 0) {
    // Germany center default
    return { type: "center", center: [9.9, 48.5], zoom: 6 }
  }
  if (reports.length === 1) {
    const r = reports[0]
    return { type: "center", center: [r.coordinates.longitude, r.coordinates.latitude], zoom: 12 }
  }
  const lngs = reports.map((r) => r.coordinates.longitude)
  const lats = reports.map((r) => r.coordinates.latitude)
  return {
    type: "bounds",
    ne: [Math.max(...lngs), Math.max(...lats)],
    sw: [Math.min(...lngs), Math.min(...lats)],
    padding: 60,
  }
}

function buildFeatureCollection(reports: ReportSummary[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: reports.map((r) => ({
      type: "Feature",
      id: r.id,
      geometry: {
        type: "Point",
        // GeoJSON coordinate order is [longitude, latitude]
        coordinates: [r.coordinates.longitude, r.coordinates.latitude],
      },
      properties: { id: r.id, title: r.title },
    })),
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ReportsMapView({ reports }: ReportsMapViewProps) {
  const { theme, themeContext } = useAppTheme()
  const isDark = themeContext === "dark"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation() as any
  const shapeSourceRef = useRef<ShapeSource>(null)

  const validReports = useMemo(() => reports.filter((r) => r.coordinates != null), [reports])
  const camera = useMemo(() => computeCamera(validReports), [validReports])
  const featureCollection = useMemo(() => buildFeatureCollection(validReports), [validReports])

  const openSheet = useCallback(
    (ids: string[]) => navigation.navigate("MapReportSheet", { reportIds: ids }),
    [navigation],
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePress = useCallback(
    async (e: { features: GeoJSON.Feature[] }) => {
      const feature = e.features[0]
      if (!feature) return

      if (feature.properties?.cluster) {
        // Expand cluster → collect all leaf report IDs
        const leaves = await shapeSourceRef.current?.getClusterLeaves(
          feature as GeoJSON.Feature<GeoJSON.Point>,
          999,
          0,
        )
        const ids = (leaves?.features ?? [])
          .map((f: GeoJSON.Feature): string | undefined => f.properties?.id as string | undefined)
          .filter((id: string | undefined): id is string => id != null)
        if (ids.length > 0) openSheet(ids)
      } else {
        const id = feature.properties?.id as string | undefined
        if (id) openSheet([id])
      }
    },
    [openSheet],
  )

  // ─── Layer styles ───────────────────────────────────────────────────────────
  // Using useMemo so styles are stable references and don't re-trigger layer re-renders.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterCircleStyle: any = useMemo(
    () => ({
      // Radius steps: <10 → 18px, <30 → 24px, else 30px
      circleRadius: ["step", ["get", "point_count"], 18, 10, 24, 30, 30],
      circleColor: theme.colors.text,
      circleOpacity: 0.9,
    }),
    [theme.colors.text],
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterCountStyle: any = useMemo(
    () => ({
      textField: "{point_count_abbreviated}",
      textColor: theme.colors.background,
      textSize: 13,
      textFont: ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      textAllowOverlap: true,
    }),
    [theme.colors.background],
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const singlePointStyle: any = useMemo(
    () => ({
      circleRadius: 8,
      circleColor: theme.colors.text,
      circleStrokeWidth: 2,
      circleStrokeColor: theme.colors.background,
    }),
    [theme.colors.text, theme.colors.background],
  )

  return (
    <MapView style={$fill} styleURL={isDark ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT}>
      {/* Camera — uses bounds when multiple reports, center+zoom otherwise */}
      {camera.type === "bounds" ? (
        <Camera
          bounds={{
            ne: camera.ne,
            sw: camera.sw,
            paddingTop: camera.padding,
            paddingBottom: camera.padding,
            paddingLeft: camera.padding,
            paddingRight: camera.padding,
          }}
          animationMode="none"
        />
      ) : (
        <Camera centerCoordinate={camera.center} zoomLevel={camera.zoom} animationMode="none" />
      )}

      {/*
       * ShapeSource drives both clusters and individual markers via a single
       * GeoJSON FeatureCollection. Mapbox handles clustering natively —
       * no third-party clustering library needed on Android.
       */}
      <ShapeSource
        id="reports"
        ref={shapeSourceRef}
        cluster
        clusterRadius={50}
        clusterMaxZoomLevel={14}
        shape={featureCollection}
        onPress={handlePress}
      >
        {/* Cluster background circles */}
        <CircleLayer
          id="cluster-circles"
          filter={["has", "point_count"]}
          style={clusterCircleStyle}
        />

        {/* Cluster count labels — rendered on top of circles */}
        <SymbolLayer id="cluster-count" filter={["has", "point_count"]} style={clusterCountStyle} />

        {/* Individual (unclustered) report markers */}
        <CircleLayer
          id="single-points"
          filter={["!", ["has", "point_count"]]}
          style={singlePointStyle}
        />
      </ShapeSource>
    </MapView>
  )
}

const $fill: ViewStyle = { flex: 1 }
