import { FC, useCallback } from "react"
import { ActivityIndicator, ScrollView, TextStyle, View, ViewStyle } from "react-native"

import { SheetReportRow } from "@/components/report/SheetReportRow"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"
import { imageUrl } from "@/utils/imageUrl"

interface MapReportSheetScreenProps extends AppStackScreenProps<"MapReportSheet"> {}

export const MapReportSheetScreen: FC<MapReportSheetScreenProps> = function MapReportSheetScreen({
  navigation,
  route,
}) {
  const { reportIds } = route.params
  const { themed, theme } = useAppTheme()
  const { data, isLoading } = useReports()
  const selected = (data?.reports ?? []).filter((r) => reportIds.includes(r.id))

  const handlePress = useCallback(
    (report: ReportSummary) => {
      navigation.navigate("ReportDetail", {
        id: report.id,
        title: report.title,
        thumbnail: imageUrl(report.thumbnail),
      })
    },
    [navigation],
  )

  return (
    <ScrollView style={themed($container)} contentInsetAdjustmentBehavior="automatic">
      {selected.length > 1 && (
        <View style={themed($header)}>
          <Text size="xs" weight="semiBold" style={themed($headerText)}>
            {selected.length} inspections at this location
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={$centered}>
          <ActivityIndicator color={theme.colors.textDim} />
        </View>
      ) : selected.length === 0 ? (
        <View style={$centered}>
          <Text size="xs" style={themed($emptyText)}>
            No report data available.
          </Text>
        </View>
      ) : (
        <View style={themed($list)}>
          {selected.map((report) => (
            <SheetReportRow key={report.id} report={report} onPress={handlePress} />
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.backgroundElevated,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
})

const $centered: ViewStyle = {
  height: 140,
  alignItems: "center",
  justifyContent: "center",
}

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textSubtle })

const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $headerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  textTransform: "uppercase",
  letterSpacing: 0.8,
})

const $list: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopWidth: 1,
  borderTopColor: colors.separator,
})
