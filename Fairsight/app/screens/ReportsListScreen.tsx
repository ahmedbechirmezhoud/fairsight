import { FC } from "react"
import { FlatList, RefreshControl, TextStyle, View, ViewStyle } from "react-native"

import { ReportCard, ReportCardSkeleton } from "@/components/report"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

const SKELETON_KEYS = ["s1", "s2", "s3", "s4"]

interface ReportsListScreenProps extends ReportsTabScreenProps<"ReportsList"> {}

export const ReportsListScreen: FC<ReportsListScreenProps> = function ReportsListScreen({
  navigation,
}) {
  const { themed, theme } = useAppTheme()
  const { data, isLoading, isError, refetch, isFetching } = useReports()
  const reports = data?.reports ?? []

  function handlePressReport(report: ReportSummary) {
    navigation.navigate("ReportDetail", { id: report.id, thumbnail: report.thumbnail })
  }

  function renderEmptyState() {
    if (isError) {
      return (
        <View style={[$centered, themed($stateContainer)]}>
          <Text size="lg" weight="semiBold" style={themed($stateTitle)}>
            Could not load reports
          </Text>
          <Text size="xs" style={themed($stateMessage)}>
            Check your connection and try again.
          </Text>
          <Text size="xs" weight="semiBold" style={themed($retryLink)} onPress={() => refetch()}>
            Retry
          </Text>
        </View>
      )
    }
    return (
      <View style={[$centered, themed($stateContainer)]}>
        <Text size="lg" weight="semiBold" style={themed($stateTitle)}>
          No reports yet
        </Text>
        <Text size="xs" style={themed($stateMessage)}>
          Reports will appear here once inspections are uploaded.
        </Text>
      </View>
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={[]} style={themed($screen)} contentContainerStyle={$fill}>
      {isLoading ? (
        <View style={themed($listContent)}>
          {SKELETON_KEYS.map((key, i) => (
            <View key={key}>
              <ReportCardSkeleton />
              {i < SKELETON_KEYS.length - 1 && <View style={themed($separator)} />}
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReportCard report={item} onPress={handlePressReport} />}
          contentContainerStyle={themed($listContent)}
          ItemSeparatorComponent={() => <View style={themed($separator)} />}
          ListEmptyComponent={renderEmptyState}
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

const $centered: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 300,
}

const $stateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  paddingHorizontal: spacing.xl,
})

const $stateTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
})

const $stateMessage: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $retryLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  textAlign: "center",
  marginTop: spacing.xs,
})
