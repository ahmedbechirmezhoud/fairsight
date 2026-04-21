import { FC } from "react"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"

import { ReportCard, ReportCardSkeleton } from "@/components/report"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

const SKELETON_KEYS = ["s1", "s2", "s3", "s4"]

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen({ navigation }) {
  const { themed } = useAppTheme()
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
    <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screen)}>
      {/* Header */}
      <View style={themed($header)}>
        <Text size="xl" weight="bold" style={themed($headerTitle)}>
          Reports
        </Text>
        {data?.total !== undefined && (
          <Text size="xs" style={themed($headerCount)}>
            {data.total} {data.total === 1 ? "report" : "reports"}
          </Text>
        )}
      </View>

      {/* List */}
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
          refreshing={isFetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  )
}

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "baseline",
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.md,
})

const $headerTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $headerCount: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
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
