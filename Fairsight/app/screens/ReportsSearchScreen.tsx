import { FC, useCallback, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
// eslint-disable-next-line no-restricted-imports
import { TextInput } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { SearchBar } from "@/components/SearchBar"
import { SearchResultsBody } from "@/components/SearchResultsBody"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

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

const $fill: ViewStyle = { flex: 1 }

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})
