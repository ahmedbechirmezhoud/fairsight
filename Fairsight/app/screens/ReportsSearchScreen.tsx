import { FC, useCallback, useRef, useState } from "react"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"
// eslint-disable-next-line no-restricted-imports
import { TextInput } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ReportCard, ReportCardSkeleton } from "@/components/report"
import { SearchBar } from "@/components/SearchBar"
import { Text } from "@/components/Text"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

const SKELETON_KEYS = ["s1", "s2", "s3"]

interface ReportsSearchScreenProps extends ReportsTabScreenProps<"ReportsSearch"> {}

export const ReportsSearchScreen: FC<ReportsSearchScreenProps> = function ReportsSearchScreen({
  navigation,
}) {
  const { themed } = useAppTheme()
  const insets = useSafeAreaInsets()
  const inputRef = useRef<TextInput>(null)
  const [query, setQuery] = useState("")

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => {
        clearTimeout(timer)
        setQuery("")
      }
    }, []),
  )

  const { data, isLoading } = useReports(
    query.trim().length > 0 ? { search: query.trim() } : undefined,
  )
  const reports = data?.reports ?? []

  const handleClose = useCallback(() => {
    inputRef.current?.blur()
    navigation.navigate("ReportsList")
  }, [navigation])

  const handlePressReport = useCallback(
    (report: ReportSummary) => {
      navigation.navigate("ReportDetail", { id: report.id, thumbnail: report.thumbnail })
    },
    [navigation],
  )

  const $topPad: ViewStyle = { paddingTop: insets.top + 12 }

  return (
    <View style={themed($screen)}>
      <Animated.View entering={FadeIn.duration(200)} style={[$fill, $topPad]}>
        <SearchResultsBody
          query={query}
          isLoading={isLoading}
          reports={reports}
          onPressReport={handlePressReport}
        />
      </Animated.View>

      <SearchBar
        inputRef={inputRef}
        value={query}
        onChangeText={setQuery}
        onClose={handleClose}
        bottomInset={insets.bottom}
      />
    </View>
  )
}

// ─── Local sub-component ──────────────────────────────────────────────────────

interface SearchResultsBodyProps {
  query: string
  isLoading: boolean
  reports: ReportSummary[]
  onPressReport: (report: ReportSummary) => void
}

function SearchResultsBody({ query, isLoading, reports, onPressReport }: SearchResultsBodyProps) {
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

// ─── Styles ──────────────────────────────────────────────────────────────────

const $fill: ViewStyle = { flex: 1 }

const $centered: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

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
