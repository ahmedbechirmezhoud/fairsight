import { FC, useCallback, useState } from "react"
import { Platform, ViewStyle } from "react-native"

import { ReportListFeed, ReportListSearchBar } from "@/components/report"
import { Screen } from "@/components/Screen"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"
import { imageUrl } from "@/utils/imageUrl"

interface ReportsListScreenProps extends ReportsTabScreenProps<"ReportsList"> {}

export const ReportsListScreen: FC<ReportsListScreenProps> = function ReportsListScreen({
  navigation,
}) {
  const { themed } = useAppTheme()
  const [query, setQuery] = useState("")

  const trimmed = query.trim()
  const { data, isLoading, isError, refetch, isFetching } = useReports(
    trimmed ? { search: trimmed } : undefined,
  )
  const reports = data?.reports ?? []

  const handlePressReport = useCallback(
    (report: ReportSummary) => {
      navigation.navigate("ReportDetail", {
        id: report.id,
        title: report.title,
        thumbnail: imageUrl(report.thumbnail),
      })
    },
    [navigation],
  )

  const listContentStyle: ViewStyle = themed($listContent)

  return (
    <Screen preset="fixed" safeAreaEdges={[]} style={themed($screen)} contentContainerStyle={$fill}>
      {Platform.OS === "android" && <ReportListSearchBar value={query} onChangeText={setQuery} />}
      <ReportListFeed
        reports={reports}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        onRefetch={refetch}
        onPressReport={handlePressReport}
        contentStyle={listContentStyle}
        query={trimmed}
      />
    </Screen>
  )
}

const $fill: ViewStyle = { flex: 1 }

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xs,
  paddingBottom: 2 * spacing.xxxl,
  flexGrow: 1,
})
