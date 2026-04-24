/**
 * Android-only static location map using Mapbox GL.
 * Used in the report detail screen to show the inspection site.
 *
 * Runtime token: set EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file.
 */
import { Linking, Pressable, View, ViewStyle, TextStyle } from "react-native"
import MapboxGL, { Camera, CircleLayer, MapView, ShapeSource } from "@rnmapbox/maps"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { MAPBOX_STYLE_DARK, MAPBOX_STYLE_LIGHT } from "@/utils/mapboxStyles"

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "")

const MAP_HEIGHT = 200
const ZOOM_LEVEL = 14 // ~500m radius, mirrors the DELTA = 0.005 used on iOS

interface LocationMapProps {
  latitude: number
  longitude: number
  title?: string
}

function openDirections(latitude: number, longitude: number, label?: string) {
  const encodedLabel = encodeURIComponent(label ?? "Inspection site")
  // Android: open Google Maps navigation
  Linking.openURL(`google.navigation:q=${latitude},${longitude}&title=${encodedLabel}`)
}

export function LocationMap({ latitude, longitude, title }: LocationMapProps) {
  const { theme, themed, themeContext } = useAppTheme()
  const isDark = themeContext === "dark"

  // GeoJSON coordinate order is [longitude, latitude]
  const coordinate: [number, number] = [longitude, latitude]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerStyle: any = {
    circleRadius: 8,
    circleColor: theme.colors.text,
    circleStrokeWidth: 2.5,
    circleStrokeColor: theme.colors.background,
  }

  const markerFeature: GeoJSON.Feature<GeoJSON.Point> = {
    type: "Feature",
    geometry: { type: "Point", coordinates: coordinate },
    properties: {},
  }

  return (
    <Pressable
      onPress={() => openDirections(latitude, longitude, title)}
      accessibilityRole="button"
      accessibilityLabel={`Open directions to ${title ?? "inspection site"}`}
    >
      <View style={themed($container)}>
        <MapView
          style={$map}
          styleURL={isDark ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          attributionEnabled={false}
          logoEnabled={false}
          scaleBarEnabled={false}
          accessibilityLabel={title ? `Map showing ${title}` : "Inspection site location"}
        >
          <Camera centerCoordinate={coordinate} zoomLevel={ZOOM_LEVEL} animationMode="none" />

          {/*
           * ShapeSource + CircleLayer avoids the "recycled bitmap" crash that
           * PointAnnotation causes when its View children re-render — PointAnnotation
           * rasterises its children to a bitmap which Android can recycle mid-draw.
           */}
          <ShapeSource id="site-marker" shape={markerFeature}>
            <CircleLayer id="site-circle" style={markerStyle} />
          </ShapeSource>
        </MapView>

        {title && (
          <View style={themed($caption)}>
            <Text size="xxs" style={themed($captionText)}>
              {title}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  borderRadius: radius.lg,
  overflow: "hidden",
  backgroundColor: colors.backgroundSurface,
})

const $map: ViewStyle = {
  width: "100%",
  height: MAP_HEIGHT,
}

const $caption: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
})

const $captionText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
