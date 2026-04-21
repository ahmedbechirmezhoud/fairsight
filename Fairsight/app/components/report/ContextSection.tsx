import { View, ViewStyle } from "react-native"

import { SectionHeader } from "@/components/SectionHeader"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { LocationMap } from "./LocationMap"
import { WeatherStats } from "./WeatherStats"

interface ContextSectionProps {
  latitude: number
  longitude: number
  location: string
  temperature_c: number
  wind_speed_kmh: number
  conditions: string
  area_sqm: number
}

export function ContextSection({
  latitude,
  longitude,
  location,
  temperature_c,
  wind_speed_kmh,
  conditions,
  area_sqm,
}: ContextSectionProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <SectionHeader title="Context" />
      <LocationMap latitude={latitude} longitude={longitude} title={location} />
      <WeatherStats
        temperature_c={temperature_c}
        wind_speed_kmh={wind_speed_kmh}
        conditions={conditions}
        area_sqm={area_sqm}
      />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})
