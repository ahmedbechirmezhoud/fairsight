import { FC } from "react"
import { View, ViewStyle } from "react-native"

import { ReportsMapView } from "@/components/report/ReportsMapView"
import { Text } from "@/components/Text"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

interface ReportsMapScreenProps extends ReportsTabScreenProps<"ReportsMap"> {}

export const ReportsMapScreen: FC<ReportsMapScreenProps> = function ReportsMapScreen({
  navigation,
}) {
  const { themed } = useAppTheme()
  const { data, isLoading } = useReports()
  const reports = data?.reports ?? []

  function handlePressReport(report: ReportSummary) {
    navigation.navigate("ReportDetail", { id: report.id, thumbnail: report.thumbnail })
  }

  if (isLoading) {
    return (
      <View style={[$fill, $centered]}>
        <Text size="xs" style={themed($loadingText)}>
          Loading map…
        </Text>
      </View>
    )
  }

  return <ReportsMapView reports={reports} onPressReport={handlePressReport} />
}

const $fill: ViewStyle = { flex: 1 }

const $centered: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $loadingText: ThemedStyle<import("react-native").TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
