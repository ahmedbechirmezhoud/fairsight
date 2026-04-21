import { View, ViewStyle } from "react-native"

import { StatCell } from "@/components/StatCell"
import { formatAltitude, formatDuration } from "@/utils/reportFormatters"

interface DroneStatsProps {
  model: string
  flight_altitude_m: number
  flight_duration_min: number
}

export function DroneStats({ model, flight_altitude_m, flight_duration_min }: DroneStatsProps) {
  return (
    <View style={$container}>
      <View style={$row}>
        <StatCell label="Altitude" value={formatAltitude(flight_altitude_m)} />
        <StatCell label="Duration" value={formatDuration(flight_duration_min)} />
      </View>
      <StatCell label="Drone Model" value={model} />
    </View>
  )
}

const $container: ViewStyle = {
  gap: 8,
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}
