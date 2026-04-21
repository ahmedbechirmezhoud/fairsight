import { View, ViewStyle } from "react-native"

import { SectionHeader } from "@/components/SectionHeader"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { DroneStats } from "./DroneStats"

interface FlightSectionProps {
  model: string
  flight_altitude_m: number
  flight_duration_min: number
}

export function FlightSection({
  model,
  flight_altitude_m,
  flight_duration_min,
}: FlightSectionProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <SectionHeader title="Flight" />
      <DroneStats
        model={model}
        flight_altitude_m={flight_altitude_m}
        flight_duration_min={flight_duration_min}
      />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})
