import { View, ViewStyle, TextStyle } from "react-native"
import MapView, { Marker } from "react-native-maps"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const MAP_HEIGHT = 200
const DELTA = 0.005 // ~500m radius zoom

interface LocationMapProps {
  latitude: number
  longitude: number
  title?: string
}

export function LocationMap({ latitude, longitude, title }: LocationMapProps) {
  const { themed, theme } = useAppTheme()

  return (
    <View style={themed($container)}>
      <MapView
        style={$map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: DELTA,
          longitudeDelta: DELTA,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        accessibilityLabel={title ? `Map showing ${title}` : "Inspection site location"}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
          pinColor={theme.colors.text}
          accessibilityLabel={`Marker at inspection site${title ? `: ${title}` : ""}`}
        />
      </MapView>
      {title && (
        <View style={themed($caption)}>
          <Text size="xxs" style={themed($captionText)}>
            {title}
          </Text>
        </View>
      )}
    </View>
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
