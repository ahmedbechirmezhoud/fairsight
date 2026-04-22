import { useCallback, useRef, useState } from "react"
import { Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet"
import MapView from "react-native-map-clustering"
import { Marker, Region } from "react-native-maps"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

import { StatusBadge } from "./StatusBadge"

interface ReportsMapViewProps {
  reports: ReportSummary[]
  onPressReport: (report: ReportSummary) => void
}

function initialRegion(reports: ReportSummary[]): Region {
  const valid = reports.filter((r) => r.coordinates != null)
  if (valid.length === 0) {
    return { latitude: 48.5, longitude: 9.9, latitudeDelta: 1, longitudeDelta: 1 }
  }
  const lats = valid.map((r) => r.coordinates.latitude)
  const lngs = valid.map((r) => r.coordinates.longitude)
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

export function ReportsMapView({ reports, onPressReport }: ReportsMapViewProps) {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()
  const sheetRef = useRef<BottomSheet>(null)
  const [selected, setSelected] = useState<ReportSummary[]>([])

  const reportById = useCallback((id: string) => reports.find((r) => r.id === id), [reports])

  const openSheet = useCallback((items: ReportSummary[]) => {
    setSelected(items)
    // Taller snap for clusters, compact for single
    sheetRef.current?.snapToIndex(items.length > 1 ? 1 : 0)
  }, [])

  const handleMarkerPress = useCallback(
    (report: ReportSummary) => {
      openSheet([report])
    },
    [openSheet],
  )

  // react-native-map-clustering's onClusterPress types declare Marker[] but
  // at runtime it passes supercluster GeoJSON leaf features — cast accordingly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClusterPress = useCallback(
    (_cluster: any, leaves?: any[]) => {
      const clusterReports = (leaves ?? [])
        .map((leaf: any) =>
          leaf?.properties?.identifier ? reportById(leaf.properties.identifier) : undefined,
        )
        .filter((r): r is ReportSummary => r != null)
      if (clusterReports.length > 0) openSheet(clusterReports)
    },
    [reportById, openSheet],
  )

  const handleSheetClose = useCallback(() => setSelected([]), [])

  const snapPoints = [`${180 + insets.bottom}`, "65%"]

  const isCluster = selected.length > 1

  return (
    <View style={$fill}>
      <MapView
        style={$fill}
        initialRegion={initialRegion(reports)}
        onPress={() => sheetRef.current?.close()}
        clusterColor={theme.colors.text}
        clusterTextColor={theme.colors.background}
        onClusterPress={handleClusterPress}
        preserveClusterPressBehavior
      >
        {reports
          .filter((r) => r.coordinates != null)
          .map((report) => (
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

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleSheetClose}
        backgroundStyle={themed($sheetBg)}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textDim }}
      >
        {isCluster ? (
          <>
            <BottomSheetView style={themed($sheetHeader)}>
              <Text size="xs" weight="semiBold" style={themed($sheetHeaderText)}>
                {selected.length} inspections at this location
              </Text>
            </BottomSheetView>
            <BottomSheetFlatList
              data={selected}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ReportCard report={item} onPress={onPressReport} themed={themed} />
              )}
              contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            />
          </>
        ) : selected.length === 1 ? (
          <BottomSheetView>
            <ReportCard report={selected[0]} onPress={onPressReport} themed={themed} />
          </BottomSheetView>
        ) : null}
      </BottomSheet>
    </View>
  )
}

// ─── Card sub-component ──────────────────────────────────────────────────────

type ThemedFn = ReturnType<typeof import("@/theme/context").useAppTheme>["themed"]

function ReportCard({
  report,
  onPress,
  themed,
}: {
  report: ReportSummary
  onPress: (r: ReportSummary) => void
  themed: ThemedFn
}) {
  return (
    <Pressable
      onPress={() => onPress(report)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${report.title}`}
      style={$cardInner}
    >
      <Image
        source={{ uri: report.thumbnail }}
        style={themed($thumb)}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel={`Thumbnail for ${report.title}`}
      />
      <View style={themed($cardContent)}>
        <StatusBadge status={report.status} />
        <Text size="sm" weight="semiBold" style={themed($cardTitle)} numberOfLines={2}>
          {report.title}
        </Text>
        <Text size="xxs" style={themed($cardLocation)} numberOfLines={1}>
          {report.location}
        </Text>
      </View>
    </Pressable>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const $fill: ViewStyle = { flex: 1 }

const $sheetBg: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  backgroundColor: colors.backgroundElevated,
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
})

const $sheetHeader: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
})

const $sheetHeaderText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  textTransform: "uppercase",
  letterSpacing: 0.8,
})

const $cardInner: ViewStyle = {
  flexDirection: "row",
}

const $thumb: ThemedStyle<ImageStyle> = () => ({
  width: 120,
  height: 110,
})

const $cardContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.sm,
  gap: spacing.xxs,
  justifyContent: "center",
})

const $cardTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $cardLocation: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
