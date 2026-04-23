import { FlatList, RefreshControl, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

import { ReportCard } from "./ReportCard"
import { ReportListEmptyState } from "./ReportListEmptyState"
import { ReportListSkeleton } from "./ReportListSkeleton"

interface ReportListFeedProps {
  reports: ReportSummary[]
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  onRefetch: () => void
  onPressReport: (report: ReportSummary) => void
  contentStyle: ViewStyle
}

export function ReportListFeed({
  reports,
  isLoading,
  isError,
  isFetching,
  onRefetch,
  onPressReport,
  contentStyle,
}: ReportListFeedProps) {
  const { themed, theme } = useAppTheme()

  if (isLoading) {
    return <ReportListSkeleton contentStyle={contentStyle} />
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReportCard report={item} onPress={onPressReport} />}
      style={$fill}
      contentContainerStyle={contentStyle}
      ItemSeparatorComponent={() => <View style={themed($separator)} />}
      ListEmptyComponent={<ReportListEmptyState isError={isError} onRetry={onRefetch} />}
      accessibilityRole="list"
      accessibilityLabel="Inspection reports"
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={onRefetch}
          tintColor={theme.colors.text}
          colors={[theme.colors.text]}
          title=""
          titleColor={theme.colors.text}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

const $fill: ViewStyle = { flex: 1 }

const $separator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.sm,
})
