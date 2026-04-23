import { useCallback, useMemo } from "react"
import { ViewStyle } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import MapView from "react-native-map-clustering"
import { Marker, Region } from "react-native-maps"

import type { AppStackParamList } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ReportSummary } from "@/types/api"
import { DARK_MAP_STYLE } from "@/utils/mapStyle"

interface ReportsMapViewProps {
  reports: ReportSummary[]
}

function computeRegion(reports: ReportSummary[]): Region {
  if (reports.length === 0) {
    return { latitude: 48.5, longitude: 9.9, latitudeDelta: 1, longitudeDelta: 1 }
  }
  const lats = reports.map((r) => r.coordinates.latitude)
  const lngs = reports.map((r) => r.coordinates.longitude)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const padding = 0.5
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat + padding, 0.05),
    longitudeDelta: Math.max(maxLng - minLng + padding, 0.05),
  }
}

export function ReportsMapView({ reports }: ReportsMapViewProps) {
  const { theme, themeContext } = useAppTheme()
  const isDark = themeContext === "dark"
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()

  // Filter once — used for both region computation and marker rendering
  const validReports = useMemo(() => reports.filter((r) => r.coordinates != null), [reports])

  // O(1) id → report lookup for cluster press handler
  const reportMap = useMemo(() => new Map(validReports.map((r) => [r.id, r])), [validReports])

  // Stable initial region — recomputed only when validReports changes
  const initialRegion = useMemo(() => computeRegion(validReports), [validReports])

  const openSheet = useCallback(
    (ids: string[]) => {
      navigation.navigate("MapReportSheet", { reportIds: ids })
    },
    [navigation],
  )

  const handleMarkerPress = useCallback(
    (report: ReportSummary) => openSheet([report.id]),
    [openSheet],
  )

  // react-native-map-clustering's onClusterPress types declare Marker[] but
  // at runtime it passes supercluster GeoJSON leaf features — cast accordingly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClusterPress = useCallback(
    (_cluster: any, leaves?: any[]) => {
      const ids = (leaves ?? [])
        .map((leaf: any) =>
          leaf?.properties?.identifier ? reportMap.get(leaf.properties.identifier)?.id : undefined,
        )
        .filter((id): id is string => id != null)
      if (ids.length > 0) openSheet(ids)
    },
    [reportMap, openSheet],
  )

  return (
    <MapView
      style={$fill}
      initialRegion={initialRegion}
      clusterColor={theme.colors.text}
      clusterTextColor={theme.colors.background}
      onClusterPress={handleClusterPress}
      preserveClusterPressBehavior
      userInterfaceStyle={isDark ? "dark" : "light"}
      customMapStyle={isDark ? DARK_MAP_STYLE : []}
    >
      {validReports.map((report) => (
        <Marker
          key={report.id}
          identifier={report.id}
          coordinate={report.coordinates}
          onPress={() => handleMarkerPress(report)}
          pinColor={theme.colors.text}
          accessibilityLabel={report.title}
        />
      ))}
    </MapView>
  )
}

const $fill: ViewStyle = { flex: 1 }
