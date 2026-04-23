import { FlatList, TextStyle, View, ViewStyle } from "react-native"

import { ReportCard, ReportCardSkeleton } from "@/components/report"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

const SKELETON_KEYS = ["s1", "s2", "s3"]

export interface SearchResultsBodyProps {
  query: string
  isLoading: boolean
  reports: ReportSummary[]
  onPressReport: (report: ReportSummary) => void
}

export function SearchResultsBody({
  query,
  isLoading,
  reports,
  onPressReport,
}: SearchResultsBodyProps) {
  const { themed } = useAppTheme()
  const trimmed = query.trim()

  if (trimmed.length === 0) {
    return (
      <View style={[$fill, $centered]}>
        <Text size="sm" style={themed($hint)}>
          Search by title or location
        </Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={themed($listContent)}>
        {SKELETON_KEYS.map((key) => (
          <View key={key} style={themed($skeletonWrap)}>
            <ReportCardSkeleton />
          </View>
        ))}
      </View>
    )
  }

  if (reports.length === 0) {
    return (
      <View style={[$fill, $centered]}>
        <Text size="sm" style={themed($hint)}>
          {`No results for "${query}"`}
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => <ReportCard report={item} onPress={onPressReport} />}
      contentContainerStyle={themed($listContent)}
      ItemSeparatorComponent={() => <View style={themed($separator)} />}
      showsVerticalScrollIndicator={false}
    />
  )
}

const $fill: ViewStyle = { flex: 1 }

const $centered: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $hint: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.lg,
  paddingTop: spacing.xs,
  flexGrow: 1,
})

const $separator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.sm,
})

const $skeletonWrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})
