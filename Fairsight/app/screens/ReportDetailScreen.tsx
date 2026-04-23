import { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { DotLottie } from "@lottiefiles/dotlottie-react-native"

import { GlassFAB } from "@/components/GlassFAB"
import { ReportDetailHeader } from "@/components/report/ReportDetailHeader"
import { ReportDetailSections } from "@/components/report/ReportDetailSections"
import { ReportHero } from "@/components/report/ReportHero"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useReport, useReportImages } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ReportDetailScreenProps extends AppStackScreenProps<"ReportDetail"> {}

export const ReportDetailScreen: FC<ReportDetailScreenProps> = function ReportDetailScreen({
  navigation,
  route,
}) {
  const { id, thumbnail } = route.params
  const { themed } = useAppTheme()

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
    refetch: refetchReport,
  } = useReport(id)

  const { data: imagesData, isLoading: imagesLoading } = useReportImages(id)
  const images = imagesData?.images ?? []

  if (reportError && !report) {
    return (
      <Screen preset="fixed" safeAreaEdges={[]} style={themed($screen)}>
        <ReportErrorState onRetry={refetchReport} />
      </Screen>
    )
  }

  return (
    <View style={$fill}>
      <Screen
        preset="scroll"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={themed($scrollContent)}
        style={themed($screen)}
      >
        <ReportHero thumbnail={thumbnail} id={id} title={report?.title} />
        <ReportDetailHeader report={report} loading={reportLoading} />
        <ReportDetailSections
          report={report}
          images={images}
          loadingReport={reportLoading}
          loadingImages={imagesLoading}
        />
      </Screen>

      {report && (
        <GlassFAB
          onPress={() =>
            navigation.navigate("ReportChat", { reportId: id, reportTitle: report.title })
          }
          accessibilityLabel="Chat about this report"
        />
      )}
    </View>
  )
}

// ─── Local error state ────────────────────────────────────────────────────────

function ReportErrorState({ onRetry }: { onRetry: () => void }) {
  const { themed } = useAppTheme()

  return (
    <View style={[$centered, themed($stateContainer)]}>
      <DotLottie
        source={require("../../assets/drone_error.lottie")}
        style={$lottie}
        autoplay
        loop
      />
      <Text size="lg" weight="semiBold" style={themed($stateTitle)}>
        Could not load report
      </Text>
      <Text size="xs" style={themed($stateMessage)}>
        Check your connection and try again.
      </Text>
      <Text size="xs" weight="semiBold" style={themed($retryLink)} onPress={onRetry}>
        Retry
      </Text>
    </View>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const $fill: ViewStyle = { flex: 1 }

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $scrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})

const $centered: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

const $lottie: ViewStyle = { width: 260, height: 260 }

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
