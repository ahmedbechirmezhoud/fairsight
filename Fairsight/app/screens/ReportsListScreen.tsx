import { FC, useCallback } from "react"
import { FlatList, RefreshControl, View, ViewStyle } from "react-native"

import { ReportCard, ReportListEmptyState, ReportListSkeleton } from "@/components/report"
import { Screen } from "@/components/Screen"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

interface ReportsListScreenProps extends ReportsTabScreenProps<"ReportsList"> {}

export const ReportsListScreen: FC<ReportsListScreenProps> = function ReportsListScreen({
  navigation,
}) {
  const { themed, theme } = useAppTheme()
  const { data, isLoading, isError, refetch, isFetching } = useReports()
  const reports = data?.reports ?? []

  const handlePressReport = useCallback(
    (report: ReportSummary) => {
      navigation.navigate("ReportDetail", { id: report.id, thumbnail: report.thumbnail })
    },
    [navigation],
  )

  const listContentStyle = themed($listContent)

  return (
    <Screen preset="fixed" safeAreaEdges={[]} style={themed($screen)} contentContainerStyle={$fill}>
      {isLoading ? (
        <ReportListSkeleton contentStyle={listContentStyle} />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReportCard report={item} onPress={handlePressReport} />}
          contentContainerStyle={listContentStyle}
          ItemSeparatorComponent={() => <View style={themed($separator)} />}
          ListEmptyComponent={<ReportListEmptyState isError={isError} onRetry={refetch} />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={theme.colors.text}
              colors={[theme.colors.text]}
              title=""
              titleColor={theme.colors.text}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  )
}

const $fill: ViewStyle = { flex: 1 }

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
  paddingTop: spacing.xs,
  flexGrow: 1,
})

const $separator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.sm,
})
