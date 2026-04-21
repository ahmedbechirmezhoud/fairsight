import { View, ViewStyle } from "react-native"

import { StatCell } from "@/components/StatCell"
import { formatArea, formatTemperature, formatWindSpeed } from "@/utils/reportFormatters"

interface WeatherStatsProps {
  temperature_c: number
  wind_speed_kmh: number
  conditions: string
  area_sqm: number
}

export function WeatherStats({
  temperature_c,
  wind_speed_kmh,
  conditions,
  area_sqm,
}: WeatherStatsProps) {
  return (
    <View style={$grid}>
      <View style={$row}>
        <StatCell label="Temperature" value={formatTemperature(temperature_c)} />
        <StatCell label="Wind" value={formatWindSpeed(wind_speed_kmh)} />
      </View>
      <View style={$row}>
        <StatCell label="Conditions" value={conditions} />
        <StatCell label="Area" value={formatArea(area_sqm)} />
      </View>
    </View>
  )
}

const $grid: ViewStyle = {
  gap: 8,
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}
